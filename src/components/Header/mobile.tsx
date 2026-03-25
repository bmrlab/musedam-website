'use client'

import { HTMLAttributes, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { cn, twx } from '@/utilities/cn'

import { SessionUser } from '@/types/user'
import useIsZhLng from '@/hooks/useIsZhLng'
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

import { LocaleLink } from '../LocalLink'
import { LocaleSwitch } from './LocalSwitch'
import { useCountry } from '@/providers/Country'

export default function HeaderMobile({
  className,
  user,
  isGlobal,
  showDarkLogo
}: { user: SessionUser | null; isGlobal: boolean; showDarkLogo?: boolean } & HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState(false)
  const scope = useMenuAnimation(isOpen)
  const { isInChina } = useCountry()

  return (
    <FlexCenterContainer
      ref={scope}
      className={cn('hidden h-full w-screen justify-start md:flex', className)}
    >
      <MobileMenu onClose={() => setIsOpen(false)} user={user} isGlobal={isGlobal} />
      <div className="shrink-0 px-4">
        <LocaleLink href="/">
          <div className="relative size-9">
            <Image src={showDarkLogo ? "/assets/logo-dark.svg" : "/assets/logo.svg"} fill alt="muse logo" />
          </div>
        </LocaleLink>
      </div>
      <div className="flex size-full flex-1 items-center justify-end gap-6">
        {isInChina && <LocaleSwitch />}
        <div
          className="z-50 h-full w-[56px] bg-black text-[16px] font-normal leading-[22px] text-white transition duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FlexCenterContainer className="size-full">
            <AnimatedMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </FlexCenterContainer>
        </div>
      </div>
    </FlexCenterContainer>
  )
}

function MobileMenu({ onClose, user, isGlobal }: { onClose: () => void; user: SessionUser | null; isGlobal: boolean }) {
  const { t } = useHeaderTranslation()
  const { data } = useHeaderData()
  // const { isInChina } = useCountry()
  const { isZhLng } = useIsZhLng()
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
        <LocaleLink href="/">
          <div className="relative size-9">
            <Image src="/assets/logo-dark.svg" fill alt="muse logo" />
          </div>
        </LocaleLink>
      </div>
      <Accordion type="single" collapsible className="no-scrollbar w-full overflow-y-scroll pb-5">
        <AccordionItemWrapper value="features" className="data-[state=open]:mb-6">
          <AccordionTriggerWrapper>{t('nav-bar.features')}</AccordionTriggerWrapper>
          {data.map(({ category, items }) => (
            <div key={category} className="flex flex-col gap-[1.2rem]">
              <AccordionContent className="pb-0 font-mono text-[14px] font-normal leading-[16px] opacity-40">
                {category}
              </AccordionContent>
              {items.map((item, i) => (
                <AccordionContent key={`${item.title}-${i}`} onClick={onClose} className="pb-0">
                  <LocaleLink href={item.url ?? ''} legacyBehavior passHref>
                    <div key={item.title} className="flex items-center gap-4">
                      <IconWrapper icon={item.icon} size={20} className="self-start text-white" />
                      <div className="flex flex-col gap-2">
                        <div className="text-[16px] font-medium leading-[16px] group-hover:after:w-full">
                          {item.title}
                        </div>
                        <div
                          className={cn(
                            'text-[13px] leading-[19.5px] text-white/60',
                            isZhLng && 'font-light',
                          )}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </LocaleLink>
                </AccordionContent>
              ))}
            </div>
          ))}
        </AccordionItemWrapper>

        <AccordionItemWrapper value="pricing">
          <AccordionTriggerWrapper disabled>
            <LocaleLink href="/pricing" onClick={onClose}>
              {t('nav-bar.pricing')}
            </LocaleLink>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>

        <AccordionItemWrapper value="inspiration-collection">
          <AccordionTriggerWrapper disabled>
            <LocaleLink href="/features/inspiration-collection" onClick={onClose}>
              {t('nav-bar.extension')}
            </LocaleLink>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>
        <AccordionItemWrapper value="about-us">
          <AccordionTriggerWrapper disabled>
            <LocaleLink href="/about-us" onClick={onClose}>
              {t('nav-bar.about-us')}
            </LocaleLink>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>
        <AccordionItemWrapper value="careers">
          <AccordionTriggerWrapper disabled>
            <LocaleLink href="/careers" onClick={onClose}>
              {t('nav-bar.careers')}
            </LocaleLink>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>

        {!isGlobal && <AccordionItemWrapper value="blog">
          <AccordionTriggerWrapper disabled>
            <LocaleLink href="/blog" onClick={onClose}>
              {t('nav-bar.blog')}
            </LocaleLink>
          </AccordionTriggerWrapper>
        </AccordionItemWrapper>}
      </Accordion>
      <div className="fixed bottom-0 left-0 h-[95px] w-screen bg-black px-[30px] py-5">
        <Link href={user ? '/home' : '/auth'} prefetch={false}>
          <button className="size-full h-[50px] rounded-[8px] bg-white font-mono text-[16px] font-normal leading-[22px] text-[#141414]">
            {user ? t('button.enter') : t('button.login')}
          </button>
        </Link>
      </div>
    </nav>
  )
}

const AccordionItemWrapper = twx(
  AccordionItem,
)`flex w-full flex-col items-start border-b-0 data-[state=open]:gap-[1.2rem]`
const AccordionTriggerWrapper = twx(
  AccordionTrigger,
)`h-[55px] justify-start gap-3 p-0 text-[24px] font-medium leading-[32px] hover:no-underline`
