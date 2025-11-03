'use client'

import { CreateSuratKeluarInut, createSuratKeluarSchema, UpdateSuratKeluarInput, updateSuratKeluarSchema } from '@/schemas/surat-keluar'
import { SuratKeluar } from '@/types/SuratKeluar'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { Textarea } from './ui/textarea'
import Link from 'next/link'
import { createSuratKeluar, updateSuratKeluar } from '@/actions/surat-keluar'
import { toast } from 'sonner'

export default function SuratKeluarForm({ suratKeluar }: { suratKeluar?: SuratKeluar }) {
  const isEdit = !!suratKeluar
  const schema = isEdit ? updateSuratKeluarSchema : createSuratKeluarSchema
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateSuratKeluarInut | UpdateSuratKeluarInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      judul: suratKeluar?.judul || "",
      tanggal: suratKeluar?.tanggal || undefined,
      penerima: suratKeluar?.penerima || "",
      keterangan: suratKeluar?.keterangan || "",
      file: undefined,
    },
    disabled: isSubmitting,
  })

  const { formState } = form

  const onSubmit = async (data: CreateSuratKeluarInut | UpdateSuratKeluarInput) => {
    setIsSubmitting(true)
    if (formState.isSubmitting) return
    const formData = new FormData()

    formData.append("judul", data.judul)
    formData.append("tanggal", data.tanggal.toISOString())
    formData.append("penerima", data.penerima)
    formData.append("keterangan", data.keterangan || "")
    if (data.file) {
      formData.append("file", data.file)
    }

    if (isEdit && suratKeluar?.id) {
      await updateSuratKeluar(suratKeluar.id, formData)
      toast.success("Surat keluar berhasil diperbarui.")
      router.push('/admin/surat-keluar')
      form.reset()
    } else {
      await createSuratKeluar(formData)
      toast.success("Surat keluar berhasil ditambahkan.")
      router.push('/admin/surat-keluar')
      form.reset()
    }
  }
  return (
    <Card className='w-full max-w-2xl mx-auto shadow-lg'>
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
              name="penerima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Penerima <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Penerima" {...field} />
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
            <div className="flex justify-end space-x-2">
              <Link href="/admin/surat-keluar">
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
