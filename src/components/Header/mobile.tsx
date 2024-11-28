import { HTMLAttributes, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { cn, twx } from '@/utilities/cn'
import { motion } from 'framer-motion'

import useIsMobile from '@/hooks/useIsMobile'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import AnimatedMenuButton from '@/components/Header/AnimatedMenuButton'
import useHeaderData from '@/components/Header/data'
import { useMenuAnimation } from '@/components/Header/useMenuAnimation'
import { IconWrapper } from '@/components/icon'
import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import { useHeaderTranslation } from '@/app/i18n/client'

export default function HeaderMobile({ className }: HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const scope = useMenuAnimation(isOpen)

  return (
    <FlexCenterContainer
      ref={scope}
      className={cn('hidden h-full w-screen justify-start md:flex', className)}
    >
      <MobileMenu onClose={() => setIsOpen(false)} />
      <div className="shrink-0 px-4">
        <Link href="/">
          <div className="relative size-9">
            <Image src="/logo.svg" fill alt="muse logo" />
          </div>
        </Link>
      </div>
      <div className="flex size-full flex-1 justify-end">
        <motion.div
          layout
          className="z-50 h-full bg-black text-[16px] font-normal leading-[22px] text-white transition duration-300"
          initial={{ width: '140px' }}
          animate={{ width: isMobile ? '56px' : '140px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FlexCenterContainer className="size-full">
            <AnimatedMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </FlexCenterContainer>
        </motion.div>
      </div>
    </FlexCenterContainer>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t } = useHeaderTranslation()
  const { data } = useHeaderData()
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        background: 'black',
        transform: 'translateY(-100%)',
        willChange: 'transform',
      }}
      className="z-50 flex flex-col justify-between px-[30px] pb-[95px] pt-[76px] text-white"
    >
      <div className="absolute left-5 top-2.5 shrink-0" onClick={onClose}>
        <Link href="/">
          <div className="relative size-9">
            <Image src="/logo-dark.svg" fill alt="muse logo" />
          </div>
        </Link>
      </div>
      <Accordion type="single" collapsible className="no-scrollbar w-full overflow-y-scroll pb-5">
        <AccordionItemWrapper value="features">
          <AccordionTriggerWrapper>{t('nav-bar.features')}</AccordionTriggerWrapper>
          {data.map(({ category, items }) => (
            <div key={category} className="flex flex-col gap-6">
              <AccordionContent className="font-mono text-[14px] font-normal leading-[16px] opacity-40">
                {category}
              </AccordionContent>
              {items.map((item, i) => (
                <AccordionContent key={`${item.title}-${i}`} onClick={onClose}>
                  <Link href={item.url ?? ''} legacyBehavior passHref>
                    <div key={item.title} className="flex items-center gap-4">
                      <IconWrapper icon={item.icon} size={20} className="self-start text-white" />
                      <div className="flex flex-col gap-2">
                        <div className="text-[16px] font-medium leading-[16px] group-hover:after:w-full">
                          {item.title}
                        </div>
                        <div className="text-[13px] leading-[19.5px] text-white/60">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                </AccordionContent>
              ))}
            </div>
          ))}
        </AccordionItemWrapper>
        <AccordionItemWrapper value="about-us">
          <AccordionTriggerWrapper disabled>
            <Link href="/about-us" onClick={onClose}>
              {t('nav-bar.about-us')}
            </Link>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>
        <AccordionItemWrapper value="careers">
          <AccordionTriggerWrapper disabled>
            <Link href="/careers" onClick={onClose}>
              {t('nav-bar.careers')}
            </Link>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>
      </Accordion>
      <div className="fixed bottom-0 left-0 h-[95px] w-screen bg-black px-[30px] py-5">
        <Link href={MUSEDAM_LOGIN_URL}>
          <button className="size-full rounded-[8px] bg-white font-mono text-[16px] font-normal leading-[22px] text-[#141414]">
            {t('button.login')}
          </button>
        </Link>
      </div>
    </nav>
  )
}

const AccordionItemWrapper = twx(
  AccordionItem,
)`flex w-full flex-col items-start border-b-0 data-[state=open]:gap-6`
const AccordionTriggerWrapper = twx(
  AccordionTrigger,
)`h-[55px] justify-start gap-3 p-0 text-[24px] font-medium leading-[32px] hover:no-underline`
