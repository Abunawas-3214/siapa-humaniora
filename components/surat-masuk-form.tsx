'use client'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { createSuratMasukSchema, CreateSuratMasukInput, updateSuratMasukSchema, UpdateSuratMasukInput } from '@/schemas/surat-masuk'
import { toast } from 'sonner'
import { createSuratMasuk, updateSuratMasuk } from '@/actions/surat-masuk'
import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SuratMasuk } from '@/types/SuratMasuk'
import { Checkbox } from './ui/checkbox'

export default function SuratMasukForm({ user, suratMasuk }: { user?: { id: string, name: string }[], suratMasuk?: SuratMasuk }) {

  const isEdit = !!suratMasuk
  const schema = isEdit ? updateSuratMasukSchema : createSuratMasukSchema
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateSuratMasukInput | UpdateSuratMasukInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      judul: suratMasuk?.judul || "",
      tanggal: suratMasuk?.tanggal || undefined,
      pengirim: suratMasuk?.pengirim || "",
      keterangan: suratMasuk?.keterangan || "",
      file: undefined,
      disposisiUserIds: suratMasuk?.assignedUsers.map(au => au.user.id) || [],
      ...(isEdit ? { resend: false } : {})
    },
    disabled: isSubmitting,
  })

  const { formState } = form

  const options = user?.map(u => ({ value: u.id, label: u.name })) || [];
  const [selectedValues, setSelectedValues] = useState(suratMasuk?.assignedUsers || []);

  const originalDisposisiIds = useMemo(() => suratMasuk?.assignedUsers.map(au => au.user.id) || [], [suratMasuk]);

  const currentDisposisiIds = form.watch('disposisiUserIds') || []
  const newFile = form.watch('file')

  const isResendMandatory = useMemo(() => {
    if (!isEdit) return false;

    const originalSorted = originalDisposisiIds.slice().sort().join(',');
    const currentSorted = currentDisposisiIds.slice().sort().join(',');

    const disposisiChanged = originalSorted !== currentSorted;
    const fileUploaded = !!newFile

    return disposisiChanged || fileUploaded;
  }, [isEdit, originalDisposisiIds, currentDisposisiIds, newFile]);

  useEffect(() => {
    if (isResendMandatory) {
      // Force set the value to true, but don't re-validate the whole form
      form.setValue('resend', true, { shouldValidate: false });
    }
  }, [isResendMandatory, form]);

  const onSubmit = async (values: CreateSuratMasukInput | UpdateSuratMasukInput) => {
    setIsSubmitting(true)
    if (formState.isSubmitting) return
    const formData = new FormData()

    values.judul && formData.append("judul", values.judul)
    values.tanggal && formData.append("tanggal", values.tanggal.toISOString())
    values.pengirim && formData.append("pengirim", values.pengirim)
    values.keterangan && formData.append("keterangan", values.keterangan)
    if (values.file) {
      formData.append("file", values.file)
    }
    formData.append("disposisiUserIds", JSON.stringify(values.disposisiUserIds))
    if ('resend' in values && typeof values.resend === 'boolean') {
      formData.append("resend", values.resend.toString())
    }

    if (isEdit && suratMasuk?.id) {
      await updateSuratMasuk(suratMasuk.id, formData)
      toast.success("Surat Masuk berhasil diupdate")
      router.push("/admin/surat-masuk")
      form.reset()
    } else {
      await createSuratMasuk(formData)
      toast.success("Surat Masuk berhasil ditambahkan")
      router.push("/admin/surat-masuk")
      form.reset()
    }

  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg p-4">
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="judul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Judul <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Judul Surat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tanggal <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"} ${formState.errors.tanggal && "border-red-500"}`}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "dd/MM/yyyy") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={date => field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pengirim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pengirim <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Pengirim" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Keterangan (opsional)" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept='application/pdf'
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disposisiUserIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disposisi User <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={options}
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEdit && (
              <FormField
                control={form.control}
                name="resend" // This is the field we added to editSuratMasukSchema
                render={({ field }) => (
                  // Simplified FormItem style for the checkbox
                  <FormItem
                    className={`flex flex-row items-start space-x-3 space-y-0 p-3 border border-gray-200 rounded-lg mb-6 transition-colors ${isResendMandatory ? 'bg-indigo-100/50 opacity-90' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="pt-1">
                      <FormControl>
                        <Checkbox
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isResendMandatory} // Only show checkbox if the field is mandatory for resending notification
                        />
                      </FormControl>
                    </div>
                    {/* Content Area using FormLabel and FormDescription */}
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        htmlFor={field.name}
                        className={`text-base font-semibold ${isResendMandatory ? 'text-indigo-700' : 'cursor-pointer'}`}
                      >
                        Kirim Ulang Notifikasi Disposisi
                      </FormLabel>
                      <FormDescription className="text-sm text-gray-600">
                        {isResendMandatory
                          ? "PENTING: Notifikasi akan dikirim ulang secara otomatis karena file atau daftar penerima disposisi telah diubah."
                          : "Centang ini untuk memastikan semua penerima disposisi menerima notifikasi ulang mengenai perubahan pada surat ini."
                        }
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end space-x-2">
              <Link href="/admin/surat-masuk">
                <Button
                  variant={"secondary"}
                  className="cursor-pointer"
                >
                  Kembali
                </Button>
              </Link>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                {
                  isEdit ? "Update Surat" : " Tambah Surat"
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
