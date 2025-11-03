import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    console.log('Starting Super Admin check...');

    // 1. Check if any user already exists
    const existingUser = await prisma.user.findFirst();

    if (existingUser) {
        console.log('Users already exist. Skipping Super Admin creation.');
        return;
    }

    // 2. Read environment variables
    const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME;
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

    if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD || !SUPER_ADMIN_NAME) {
        console.error("Missing SUPER_ADMIN credentials in .env file. Cannot create Super Admin.");
        return;
    }

    // 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    // 4. Create the Super Admin user
    const superAdmin = await prisma.user.create({
        data: {
            name: SUPER_ADMIN_NAME,
            email: SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isAdmin: true,
            isSuperAdmin: true,
            jabatan: "Super Admin", // Optionally set a default jabatan
        },
    });

    console.log(`Successfully created Super Admin: ${superAdmin.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
		await prisma.$disconnect();
    });
