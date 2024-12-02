'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormControl, FormField, FormItem, FormMessage, Form as FormUI } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BlackButton } from '@/components/StyleWrapper/button'
import { useLandingPageTranslation } from '@/app/i18n/client'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
})

export default function SubscribeForm({ form }: { form: Form }) {
  const { id: formID, confirmationType, redirect } = form

  const { t } = useLandingPageTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fields = form?.fields?.[0]

  const formRe = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  console.log('form', form)
  console.log('fields', fields)

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

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

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            formRe.setError('email', {
              type: 'manual',
              message: res.message,
            })

            return
          }

          setIsLoading(false)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          formRe.setError('email', {
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <FormUI {...formRe}>
      <form id={formID.toString()} onSubmit={formRe.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col justify-center gap-2.5 md:flex-row">
          <FormField
            control={formRe.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t('subscribe.email.placeholder')}
                    className="h-[54px] w-full rounded-[6px] border-none bg-white p-4 font-mono shadow-none placeholder:font-mono placeholder:font-light placeholder:opacity-30 md:h-[50px] md:w-[420px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BlackButton
            type="submit"
            className="h-[54px] rounded-[6px] px-[56.5px] font-mono leading-[20.8px] text-white md:h-[50px]"
          >
            {t('subscribe.button')}
          </BlackButton>
        </div>
      </form>
    </FormUI>
  )
}
