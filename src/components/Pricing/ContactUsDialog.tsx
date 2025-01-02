import { cn } from '@/utilities/cn'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { useCopyToClipboard } from 'react-use'
import { Cross2Icon } from '@radix-ui/react-icons'

const CONTACT_EMAIL = 'contact@museai.cc'

export default function ContactUsDialog({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { toast } = useToast()
  const { t } = useTranslation('pricing')

  const [, copyToClipboard] = useCopyToClipboard()

  const handleCopy = useCallback(() => {
    copyToClipboard(CONTACT_EMAIL)
    toast(({
      duration: 800,
      description: t('contact.copy.success'),
    }))
  }, [copyToClipboard, t])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-[50] fixed bottom-0 left-0 right-0 top-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[2px] animate-in fade-in" />

        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] px-7 z-[51]">
          <div className={cn(
            'relative h-[352px] w-full max-w-[320px] divide-y overflow-hidden rounded-md bg-background px-[30px] py-[40px] md:mx-auto md:max-w-[352px]',
            'animate-in fade-in-90 zoom-in-90'
          )}>
            <div className="mb-5 flex w-full flex-col items-center justify-start">
              <Dialog.Title className="mb-4 text-[18px] font-bold leading-5 text-default">
                {t('contact.title')}
              </Dialog.Title>
              <Image
                alt="contact"
                src='/assets/Pricing/qr-contactUs.jpeg'
                width={150}
                height={150}
                className="mb-3 h-[130px] w-[130px] object-contain object-center"
              />
              <p className="text-center text-[13px] font-normal leading-[18px] text-lighter">
                {t("pricing.flagship.consult")}
              </p>
            </div>
            <div className="flex w-full items-center justify-center space-x-2 pt-5 text-[13px] leading-[18px] text-description">
              <span>{t('contact.email')}: </span>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hidden md:inline-block" tabIndex={-1}>
                {CONTACT_EMAIL}
              </a>
              <span className="inline-block cursor-pointer md:hidden" onClick={handleCopy}>
                {CONTACT_EMAIL}
              </span>
            </div>
            <Dialog.Close className={cn(
              'absolute right-1 top-1 h-8 w-8 border-none p-2 text-secondary outline-none duration-200 focus-within:outline-none hover:text-default',
            )}>
              <Cross2Icon className="h-4 w-4" />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
