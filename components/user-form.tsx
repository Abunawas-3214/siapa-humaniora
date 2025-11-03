"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { UserModelType } from "@/prisma/generated/schemas"
import { createUserSchema, CreateUserInput, updateUserSchema, UpdateUserInput } from "@/schemas/user"
import { createUser, updateUser } from "@/actions/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import { User } from "@prisma/client"
import { signOut, useSession } from "next-auth/react"

export function UserForm({ user }: { user?: User | null }) {
  // Choose schema and type based on whether user exists
  const isEdit = !!user
  const schema = isEdit ? updateUserSchema : createUserSchema

  const router = useRouter()
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      jabatan: user?.jabatan || "",
      isAdmin: user?.isAdmin || false,
    },
    disabled: isSubmitting
  })

  const { formState, watch } = form;
  const currentEmail = watch("email")

  // Check if the logged-in user edits their own account and changes email
  const isSelfEdit = session?.user?.id === user?.id
  const emailChanged = isSelfEdit && currentEmail !== user?.email

  const onSubmit = async (values: CreateUserInput | UpdateUserInput) => {
    setIsSubmitting(true)
    try {
      if (isEdit && user?.id) {
        await updateUser(user.id, values as UpdateUserInput)

        if (isSelfEdit && emailChanged) {
          toast.warning("Email diubah. Anda akan keluar untuk memperbarui sesi.")
          // Optionally wait a bit before logging out
          setTimeout(() => signOut({ callbackUrl: "/admin" }), 3000)
        } else {
          toast.success("User berhasil diupdate")
          router.push("/admin/user")
        }
      } else {
        await createUser(values as CreateUserInput)
        toast.success("User berhasil ditambahkan")
        router.push("/admin/user")
      }

      form.reset()
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error("Terjadi kesalahan saat menyimpan data.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg p-8">
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} type="email" />
                  </FormControl>
                  {emailChanged && (
                    <FormDescription className="text-amber-600">
                      Anda mengubah email Anda. Anda akan keluar setelah menyimpan perubahan.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {session?.user.isAdmin &&
              (
                <>
                  <FormField
                    control={form.control}
                    name="jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan (Position)</FormLabel>
                        <FormControl>
                          <Input placeholder="Jabatan" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAdmin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Is Admin
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )
            }
            <div className="flex justify-end space-x-2">
              <Link href="/admin/user">
                <Button
                  variant={"secondary"}
                  className="cursor-pointer"
                  disabled={formState.isSubmitting || isSubmitting}
                >
                  Kembali
                </Button>
              </Link>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={formState.isSubmitting || isSubmitting}
              >
                {
                  formState.isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    isEdit ? "Update User" : "Tambah User"
                  )
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}