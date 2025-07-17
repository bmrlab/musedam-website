/*
 * @Author: fuxuewei fuxuewei@tezign.com
 * @Date: 2025-04-23 16:29:10
 * @LastEditors: fuxuewei fuxuewei@tezign.com
 * @LastEditTime: 2025-07-15 11:43:18
 * @FilePath: /musedam-website/src/components/Pricing/ContactUsDialog.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { cn } from '@/utilities/cn'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { useCopyToClipboard } from 'react-use'
import { Cross2Icon } from '@radix-ui/react-icons'


export default function ContactUsDialog({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { toast } = useToast()
  const { t } = useTranslation('pricing')
  const CONTACT_EMAIL = process.env.DEPLOY_REGION === 'mainland' ? 'contact@musedam.cc' : 'contact@museai.cc'
  const [, copyToClipboard] = useCopyToClipboard()

  const handleCopy = useCallback(() => {
    copyToClipboard(CONTACT_EMAIL)
    toast(({
      duration: 800,
      description: t('contact.copy.success'),
    }))
  }, [CONTACT_EMAIL, copyToClipboard, t, toast])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.8)] backdrop-blur-[2px] animate-in fade-in" />

        <Dialog.Content className="fixed left-[50%] top-[50%] z-[51] translate-x-[-50%] translate-y-[-50%] px-7">
          <div className={cn(
            'relative w-[320px] max-w-full divide-y overflow-hidden rounded-md bg-background px-[30px] py-[40px] md:mx-auto md:w-[352px]',
            'animate-in fade-in-90 zoom-in-90'
          )}>
            <div className="mb-5 flex w-full flex-col items-center justify-start">
              <Dialog.Title className="text-default mb-4 text-[18px] font-bold leading-5">
                {t('contact.title')}
              </Dialog.Title>
              <Image
                alt="contact"
                src='/assets/Pricing/qr-contactUs.jpeg'
                width={150}
                height={150}
                className="mb-3 size-[130px] object-contain object-center"
              />
              <p className="text-lighter text-center text-[13px] font-normal leading-[18px] text-[#95989F]">
                {t("pricing.flagship.consult")}
              </p>
            </div>
            <div className="text-description flex w-full items-center justify-center space-x-2 pt-5 text-[13px] leading-[18px]">
              <span>{t('contact.email')}: </span>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hidden md:inline-block" tabIndex={-1}>
                {CONTACT_EMAIL}
              </a>
              <span className="inline-block cursor-pointer md:hidden" onClick={handleCopy}>
                {CONTACT_EMAIL}
              </span>
            </div>
            <Dialog.Close className={cn(
              'hover:text-default absolute right-1 top-1 size-8 border-none p-2 text-secondary outline-none duration-200 focus-within:outline-none',
            )}>
              <Cross2Icon className="size-4" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
