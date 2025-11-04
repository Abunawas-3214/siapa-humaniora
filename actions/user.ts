'use server'

import { revalidatePath } from 'next/cache'
import { hash } from 'bcryptjs'
import { prisma } from "@/lib/prisma";
import { CreateUserInput, createUserSchema, UpdateUserInput, updateUserSchema } from '@/schemas/user'

export async function createUser(data: CreateUserInput) {
	// Validate the input data using Zod schema
	const validatedData = createUserSchema.parse(data)
	// Hash the password before saving to the database
	const hashedPassword = await hash(validatedData.password, 12)
	const user = await prisma.user.create({
		data: {
			...validatedData,
			password: hashedPassword,
		},
	})
	// Revalidate the path to update any cached data
	revalidatePath('/admin/user')
	return user
}

export async function updateUser(userId: string, values: Partial<UpdateUserInput>) {
	// Validate the input data using Zod schema (partial update)
	const validatedData = updateUserSchema.partial().parse(values)
	// If password is being updated, hash it
	let updatedData = { ...validatedData }
	if (validatedData.password) {
		const hashedPassword = await hash(validatedData.password, 12)
		updatedData.password = hashedPassword
	}

	// Check if the user exists and load their linked accounts
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: { accounts: true },
	});

	if (!user) {
		throw new Error("User not found.");
	}

	// If updating email → ensure uniqueness
	if (validatedData.email) {
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		});
		if (existingUser && existingUser.id !== userId) {
			throw new Error("Email already in use by another user.");
		}
	}

	// If user changes email AND has a linked Google account → unlink it
	const isEmailChanged =
		validatedData.email && validatedData.email !== user.email;

	const googleAccount = user.accounts.find(
		(acc) => acc.provider === "google"
	);

	if (googleAccount && isEmailChanged) {
		await prisma.account.delete({
			where: { id: googleAccount.id },
		});
	}

	// Update the user data
	await prisma.user.update({
		where: { id: userId },
		data: updatedData,
	});

	// Revalidate caches for admin panel or user list
	revalidatePath("/admin/user");

	// Return flag if logout is required (for frontend logic)
	return { success: true, shouldLogout: !!(googleAccount && isEmailChanged) };
}

export async function deleteUser(userId: string) {
	await prisma.user.delete({
		where: { id: userId },
	})
	// Revalidate the path to update any cached data
	revalidatePath('/admin/user')
}