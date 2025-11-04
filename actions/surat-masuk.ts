'use server'

import { prisma } from "@/lib/prisma";
import { EmailStatus, Prisma } from "@prisma/client"
import { createSuratMasukSchema, updateSuratMasukSchema } from "@/schemas/surat-masuk"
import path from "path"
import fs from "fs/promises"
import nodemailer from "nodemailer"
import { revalidatePath, unstable_noStore } from "next/cache"
import { revalidateSuratChart } from "./surat-data"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Nodemailer Configuration ---
// This uses environment variables (EMAIL_SERVER, EMAIL_USER, etc.) 
// which must be configured for your Gmail App Password setup.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Actual Email Sending Function ---
interface EmailResult {
  success: boolean;
  error?: string;
}

async function sendNotificationEmail(
  recipientEmail: string,
  suratTitle: string,
  suratURL: string,
  suratPengirim: string,
  suratTanggal: Date,
  suratKeterangan?: string,
  isUpdate: boolean = false
): Promise<EmailResult> {

  // Construct the link to the document (requires NEXT_PUBLIC_APP_URL in .env)
  const suratLink = `${process.env.NEXT_PUBLIC_APP_URL}${suratURL}`;

  // 💡 EDIT: Conditional Subject Line
  const emailSubject = isUpdate
    ? `[UPDATE] Disposisi Surat: ${suratTitle}`
    : `Tugas Disposisi Baru: ${suratTitle}`;

  // 💡 EDIT: Conditional Content based on isUpdate
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Disposisi Surat Masuk ${isUpdate ? 'Diperbarui' : 'Baru'}</h2>
        ${isUpdate
      ? `<p style="color: #dc3545; font-weight: bold;">PENTING: Surat ini telah diperbarui atau disposisi dikirim ulang.</p>
               <p>Anda menerima notifikasi ini karena Anda ditugaskan ke surat yang datanya telah direvisi.</p>`
      : '<p>Anda telah ditugaskan untuk disposisi surat masuk baru:</p>'}
        <p style="font-size: 16px; font-weight: bold; color: #007bff;">${suratTitle}</p>
        <p>Pengirim: ${suratPengirim}</p>
        <p>Tanggal: ${suratTanggal.toLocaleDateString()}</p>
        ${suratKeterangan
      ? `<p style="color: grey; font-style: italic">${suratKeterangan}</p>`
      : ''
    }
        <br>
        <p>Silakan segera cek dan tindak lanjuti dokumen ini.</p>
        <div style="margin-top: 20px;">
            <a href="${suratLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Lihat Surat
            </a>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #777;">Ini adalah email notifikasi otomatis.</p>
    </div>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Sistem Persuratan'}" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: emailSubject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent for: "${suratTitle}" to: ${recipientEmail}. Update status: ${isUpdate}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown email error';
    console.error(`Email failed for ${recipientEmail}: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}
// --- End Email Function ---

const PUBLIC_DIR = path.join(process.cwd(), 'uploads', 'surat-masuk')

export async function createSuratMasuk(data: FormData) {
  // Validate data if needed
  // const validatedData = createSuratMasukSchema.parse(data)

  const rawData = {
    judul: data.get('judul') as string,
    tanggal: new Date(data.get('tanggal') as string),
    pengirim: data.get('pengirim') as string,
    keterangan: data.get('keterangan') as string | null,
    file: data.get('file') as File,
    disposisiUserIds: JSON.parse(data.get('disposisiUserIds') as string) as string[],
  }

  const validatedFields = createSuratMasukSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  const { judul, tanggal, pengirim, keterangan, file, disposisiUserIds } = validatedFields.data;

  // Convert Zod's Date object to a clean JavaScript Date object
  const suratTanggal = new Date(tanggal);

  // Query Users for Emails (Securely fetch necessary data)
  const assignedUsers = await prisma.user.findMany({
    where: { id: { in: disposisiUserIds } },
    select: { id: true, email: true, name: true },
  });

  if (assignedUsers.length !== disposisiUserIds.length) {
    return {
      success: false,
      message: 'One or more assigned user IDs are invalid or could not be found.',
    };
  }

  const buffer = Buffer.from(await rawData.file.arrayBuffer())
  const filename = `${Date.now()}_${rawData.file.name}`
  const filePath = path.join(PUBLIC_DIR, filename)

  // Ensure directory exists
  await fs.mkdir(PUBLIC_DIR, { recursive: true })
  await fs.writeFile(filePath, buffer)

  const fileUrl = `/uploads/surat-masuk/${filename}`
  let suratMasukId: string | null = null;

  // Save record to database
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const suratMasuk = await tx.suratMasuk.create({
        data: {
          judul,
          tanggal: suratTanggal,
          pengirim,
          keterangan,
          fileUrl,
        },
        select: { id: true },
      });
      suratMasukId = suratMasuk.id;

      const disposisiData = assignedUsers.map(user => ({
        suratMasukId: suratMasukId!,
        userId: user.id,
      }))

      await tx.suratMasukDisposisi.createMany({
        data: disposisiData,
      })
    });
  } catch (error) {
    // Log the error and fail the Server Action
    console.error('DATABASE TRANSACTION OR FILE WRITE ERROR:', error);
    return {
      success: false,
      message: 'Failed to create record or assign users due to a system error.',
    };
  }

  if (!suratMasukId) {
    return {
      success: false,
      message: 'SuratMasuk ID was not generated.',
    };
  }

  const asyncEmailProcess = (async () => {
    // 🚨 ADDED 5-SECOND DELAY (20000 milliseconds) for visibility during testing
    // console.log(`Starting 20 second delay for Surat ID: ${suratMasukId}...`);
    // await delay(20000);
    // console.log(`Delay complete. Resuming email processing for Surat ID: ${suratMasukId}.`);

    // Send Emails and Update Status (Post-Transaction)
    const emailPromises = assignedUsers.map(async (user) => {
      // 🚨 Call the Nodemailer function with the required parameters
      const result = await sendNotificationEmail(user.email, judul, fileUrl, pengirim, suratTanggal, keterangan || undefined);

      const updateData: { emailStatus: EmailStatus, emailSentAt?: Date, emailErrorMessage?: string } = {
        emailStatus: result.success ? EmailStatus.SENT : EmailStatus.FAILED,
      };

      if (result.success) {
        updateData.emailSentAt = new Date();
      } else {
        // Record the actual error message from the email attempt
        updateData.emailErrorMessage = result.error;
      }

      // Update the specific Disposisi record for this user
      await prisma.suratMasukDisposisi.update({
        where: {
          suratMasukId_userId: {
            suratMasukId: suratMasukId!,
            userId: user.id
          }
        },
        data: updateData,
      });

      return { userId: user.id, success: result.success };
    });

    // Wait for all email status updates to finish
    await Promise.all(emailPromises);

    await prisma.suratMasuk.update({
      where: { id: suratMasukId! },
      data: { isEmailSent: true }
    });

    console.log(`All email processes completed for SuratMasuk ID: ${suratMasukId}`);
  })()

  revalidatePath('/admin/surat-masuk');
  await revalidateSuratChart();

  return {
    success: true,
    message: `Surat Masuk "${judul}" created, assigned, and notifications processed.`,
  };

}

export async function updateSuratMasuk(id: string, data: FormData) {
  unstable_noStore();

  const rawData = {
    judul: data.get('judul') as string,
    tanggal: new Date(data.get('tanggal') as string),
    pengirim: data.get('pengirim') as string,
    keterangan: data.get('keterangan') as string | null,
    file: data.get('file') as File | null,
    disposisiUserIds: JSON.parse(data.get('disposisiUserIds') as string) as string[],
    // Convert "true"/"false" string from FormData to boolean
    resend: data.get('resend') === 'true',
  }

  // --- Validate incoming data using the updated schema ---
  const validatedFields = updateSuratMasukSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  const { judul, tanggal, pengirim, keterangan, file, disposisiUserIds, resend } = validatedFields.data;
  let newFileUrl: string | undefined = undefined;

  try {
    if (file && file.size > 0) {
      // Find the existing record to get the old file path
      const existingSurat = await prisma.suratMasuk.findUnique({
        where: { id },
        select: { fileUrl: true }
      });

      // 1a. Delete Old File
      if (existingSurat?.fileUrl) {
        const oldFilePath = path.join(process.cwd(), 'uploads', existingSurat.fileUrl);
        await fs.unlink(oldFilePath).catch(err => {
          console.warn('Warning: Failed to delete old file:', err.message);
        });
      }

      // 1b. Upload New File
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}_${file.name}`;
      const filePath = path.join(PUBLIC_DIR, filename);

      await fs.mkdir(PUBLIC_DIR, { recursive: true });
      await fs.writeFile(filePath, buffer);
      newFileUrl = `/uploads/surat-masuk/${filename}`;
    }
  } catch (error) {
    console.error('File operation error during update:', error);
    return { success: false, message: 'Failed to process file upload.' };
  }
  let usersToNotifyIds: string[] = [];
  let finalFileUrl: string | null = null;

  // --- 2. DATABASE TRANSACTION (Update, Add/Remove Disposisi) ---
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 2a. Get Current Disposisi
      const currentDisposisi = await tx.suratMasukDisposisi.findMany({
        where: { suratMasukId: id },
        select: { userId: true },
      });
      const currentDisposisiIds = currentDisposisi.map(d => d.userId);

      // 2b. Determine Changes
      const addedUserIds = disposisiUserIds.filter(newId => !currentDisposisiIds.includes(newId));
      const removedUserIds = currentDisposisiIds.filter(currentId => !disposisiUserIds.includes(currentId));

      // 2c. Delete Removed Disposisi Records
      if (removedUserIds.length > 0) {
        await tx.suratMasukDisposisi.deleteMany({
          where: {
            suratMasukId: id,
            userId: { in: removedUserIds }
          }
        });
      }

      // 2d. Create New Disposisi Records
      if (addedUserIds.length > 0) {
        const disposisiData = addedUserIds.map(userId => ({
          suratMasukId: id,
          userId: userId,
          emailStatus: EmailStatus.PENDING, // Mark as PENDING for new assignments
        }));
        await tx.suratMasukDisposisi.createMany({
          data: disposisiData,
        });
      }

      // 2e. Update Main SuratMasuk Record
      const updatedSurat = await tx.suratMasuk.update({
        where: { id },
        data: {
          judul,
          tanggal, // Use the validated Date object directly
          pengirim,
          keterangan,
          ...(newFileUrl && { fileUrl: newFileUrl }),
          // If users were added or resend is requested, reset/start notification process
          isEmailSent: (addedUserIds.length > 0 || resend) ? false : true,
        },
        select: { fileUrl: true }
      });
      finalFileUrl = updatedSurat.fileUrl;

      // 2f. Determine Users to Notify
      if (resend) {
        // If 'resend' is true, notify everyone currently assigned
        // Also reset their email status to PENDING before the email process starts
        await tx.suratMasukDisposisi.updateMany({
          where: { suratMasukId: id },
          data: { emailStatus: EmailStatus.PENDING, emailSentAt: null, emailErrorMessage: null },
        });
        usersToNotifyIds = disposisiUserIds;
      } else {
        // If 'resend' is false, only notify the newly added users
        usersToNotifyIds = addedUserIds;
      }
    });
  } catch (error) {
    console.error('DATABASE TRANSACTION ERROR DURING UPDATE:', error);
    return {
      success: false,
      message: 'Failed to update record or disposisi users due to a system error.',
    };
  }

  // --- 3. ASYNCHRONOUS EMAIL PROCESS ---
  if (usersToNotifyIds.length > 0 && finalFileUrl) {
    const usersToNotify = await prisma.user.findMany({
      where: { id: { in: usersToNotifyIds } },
      select: { id: true, email: true, name: true },
    });

    // Run the email sending process asynchronously
    (async () => {
      const emailPromises = usersToNotify.map(async (user) => {
        const result = await sendNotificationEmail(
          user.email,
          judul,
          finalFileUrl!,
          pengirim,
          tanggal, // Use the validated Date object
          keterangan || undefined,
          true
        );

        const updateData: { emailStatus: EmailStatus, emailSentAt?: Date, emailErrorMessage?: string | null } = {
          emailStatus: result.success ? EmailStatus.SENT : EmailStatus.FAILED,
        };

        if (result.success) {
          updateData.emailSentAt = new Date();
          updateData.emailErrorMessage = null;
        } else {
          updateData.emailErrorMessage = result.error;
        }

        // Update the specific Disposisi record for this user
        await prisma.suratMasukDisposisi.update({
          where: {
            suratMasukId_userId: {
              suratMasukId: id,
              userId: user.id
            }
          },
          data: updateData,
        });

        return { userId: user.id, success: result.success };
      });

      await Promise.all(emailPromises);

      // Final step: update the main surat record to indicate email attempt is done
      await prisma.suratMasuk.update({
        where: { id },
        data: { isEmailSent: true }
      });

      console.log(`All email processes completed for updated SuratMasuk ID: ${id}. ${usersToNotify.length} users notified.`);
    })();
  }

  // --- 4. REVALIDATION ---
  revalidatePath('/admin/surat-masuk');
  await revalidateSuratChart();

  return {
    success: true,
    message: `Surat Masuk "${judul}" updated successfully.`,
  };
}

export async function deleteSuratMasuk(id: string) {
  try {
    const suratMasuk = await prisma.suratMasuk.findUnique({
      where: { id },
      select: { fileUrl: true }
    })

    if (suratMasuk?.fileUrl) {
      const filePath = path.join(process.cwd(), 'uploads', suratMasuk.fileUrl)
      await fs.unlink(filePath).catch((err) => {
        console.error('File deletion error (may not exist):', err);
      })
    }

    await prisma.suratMasuk.delete({
      where: { id }
    })
    revalidatePath('/admin/surat-masuk')
    await revalidateSuratChart()
  } catch (error) {
    console.error('Error deleting SuratMasuk:', error);
    throw new Error('Failed to delete SuratMasuk due to a system error.');
  }
}