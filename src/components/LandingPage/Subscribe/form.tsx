'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useToast } from '@/hooks/use-toast'
import { FormControl, FormField, FormItem, FormMessage, Form as FormUI } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Icons from '@/components/icon'
import { BlackButton } from '@/components/StyleWrapper/button'
import { useLandingPageTranslation } from '@/app/i18n/client'

export default function SubscribeForm({ form }: { form: Form }) {
  const { id: formID, confirmationType, redirect } = form

  const { t } = useLandingPageTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.string().email({ message: t('subscribe.email.invalid') }),
      }),
    [t],
  )

  const formRe = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      setIsLoading(true)
      const submitForm = async () => {
        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          setIsLoading(false)

          if (req.status >= 400) {
            toast({
              duration: 800,
              description: t('subscribe.error'),
            })
          }

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
          toast({
            duration: 800,
            description: t('subscribe.success'),
          })
        } catch (err) {
          setIsLoading(false)
          console.error(err)
          toast({
            duration: 800,
            description: t('subscribe.error'),
          })
        }
      }

      void submitForm()
    },
    [formID, confirmationType, redirect, toast, t, router],
  )

  return (
    <FormUI {...formRe}>
      <form id={formID.toString()} onSubmit={formRe.handleSubmit(onSubmit)} className="w-full">
        <div className="flex w-full flex-col justify-center gap-2.5 md:flex-row">
          <FormField
            control={formRe.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('subscribe.email.placeholder')}
                    className="h-[54px] w-full rounded-[6px] border-none bg-white p-4 font-mono shadow-none placeholder:font-mono placeholder:font-light placeholder:opacity-30 md:h-[50px] md:w-[420px]"
                  />
                </FormControl>
                <FormMessage className="font-mono text-[13px] font-light leading-[16.9px] text-[#F9434D]" />
              </FormItem>
            )}
          />
          <BlackButton
            type="submit"
            className="flex h-[54px] items-center justify-center gap-2 rounded-[6px] px-[56.5px] font-mono leading-[20.8px] text-white md:h-[50px]"
          >
            {isLoading && <Icons.quarterCircle className="animate-spin" />}
            {t('subscribe.button')}
          </BlackButton>
        </div>
      </form>
    </FormUI>
  )
}
