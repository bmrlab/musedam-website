'use client'

import { HTMLAttributes, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { LucideProps } from 'lucide-react'

import { SessionUser } from '@/types/user'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import useHeaderData, { FeatureItem } from '@/components/Header/data'
import { MotionImage } from '@/components/StyleWrapper/image'
import { useHeaderTranslation } from '@/app/i18n/client'

import { LocaleLink } from '../LocalLink'
import { LocaleSwitch } from './LocalSwitch'
import { DarkButton } from '../StyleWrapper/button'

const DEFAULT_HERO_IMAGE = '/assets/Navbar-Images/BMR-Logo.svg'

const IconWrapper: React.FC<LucideProps & { icon: React.ComponentType<LucideProps> }> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />
}

export default function HeaderDesktop({
  className,
  hideMenu,
  user,
  isGlobal,
  isEnterprisePage
}: { isEnterprisePage?: boolean; hideMenu?: boolean; user: SessionUser | null; isGlobal: boolean } & HTMLAttributes<HTMLDivElement>) {
  const { t } = useHeaderTranslation()
  const [currentHeroImage, setCurrentHeroImage] = useState<string>()
  const { data: features } = useHeaderData()

  const categories = useMemo(() => features.map((f) => f.category), [features])

  const featuresRowFlat = useMemo(() => {
    const rowFlatItems: FeatureItem[] = []
    new Array(Math.max(...features.map((f) => f.items.length))).fill(0).forEach((_, i) => {
      new Array(features.length).fill(0).forEach((_, j) => {
        const data = features[j].items[i]
        rowFlatItems.push(data)
      })
    })
    return rowFlatItems
  }, [features])

  const renderMenus = () => {
    return <NavigationMenuList className="hidden flex-1 md:flex">
      <NavigationMenuItem>
        <NavigationMenuTrigger className="font-normal">
          {t('nav-bar.features')}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid h-full w-screen grid-cols-3">
            <ul className="col-span-2 grid w-full grid-cols-3 gap-x-[20px] gap-y-[15px] p-[60px]">
              {categories.map((category, i) => (
                <motion.div
                  key={i}
                  className="text-[14px] font-normal leading-4 text-black/40 "
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {category}
                </motion.div>
              ))}
              {featuresRowFlat.map((data, i) => (
                <motion.li
                  key={i}
                  className="group"
                  onMouseOver={() => setCurrentHeroImage(data.heroImage ?? '')}
                  onMouseLeave={() => setCurrentHeroImage('')}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.02,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <LocaleLink href={data.url ?? ''} legacyBehavior passHref>
                    <NavigationMenuLink asChild>
                      <a
                        className={cn(
                          'block cursor-pointer select-none space-y-1 rounded-md py-3 leading-none no-underline outline-none',
                        )}
                      >
                        <div
                          key={data.title}
                          className={cn(
                            "flex items-center gap-6 text-[#141414] transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ",
                            // "dark:text-white dark:hover:text-[rgba(255,255,255,0.8)] dark:focus:text-[rgba(255,255,255,0.8)]"
                          )}
                        >
                          <IconWrapper
                            icon={data.icon}
                            size={20}
                            className="self-start text-[#141414] "
                          />
                          <div className="flex flex-col gap-2">
                            <div className="underline-animation text-[16px] font-normal leading-[20.2px] group-hover:after:w-full">
                              {data.title}
                            </div>
                            <div className="text-[13px] font-light leading-[19.5px]">
                              {data.description}
                            </div>
                          </div>
                        </div>
                      </a>
                    </NavigationMenuLink>
                  </LocaleLink>
                </motion.li>
              ))}
            </ul>
            <div
              style={{
                background:
                  'linear-gradient(0.31deg, #DFE3FF -8.1%, #EEF3FF 63.28%, #F6F8FF 99.04%)',
              }}
              className="relative col-span-1 size-full"
            >
              <AnimatePresence mode="wait">
                {!!currentHeroImage ? (
                  <div className="flex size-full items-center justify-center">
                    <MotionImage
                      key={currentHeroImage}
                      src={currentHeroImage}
                      width={430}
                      height={430}
                      priority
                      alt="hero image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      exit={{ opacity: 0 }}
                    />
                  </div>
                ) : (
                  <div className="flex size-full items-end justify-center pb-[70px]">
                    <MotionImage
                      src={DEFAULT_HERO_IMAGE}
                      width={327}
                      height={286}
                      priority
                      alt="bmr logo"
                      initial={{
                        opacity: 0,
                        y: 50,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      {/* 海外版-隐藏Pricing */}
      {!isGlobal && <NavigationMenuItem>
        <LocaleLink
          href={`/pricing${user?.isOrg ? '?plan=team' : '?plan=personal'}`}
          legacyBehavior
          passHref
        >
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-normal')}>
            {t('nav-bar.pricing')}
          </NavigationMenuLink>
        </LocaleLink>
      </NavigationMenuItem>}
      <NavigationMenuItem>
        <LocaleLink href="/features/inspiration-collection" legacyBehavior passHref>
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-normal')}>
            {t('nav-bar.extension')}
          </NavigationMenuLink>
        </LocaleLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <LocaleLink href="/about-us" legacyBehavior passHref>
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-normal')}>
            {t('nav-bar.about-us')}
          </NavigationMenuLink>
        </LocaleLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <LocaleLink href="/careers" legacyBehavior passHref>
          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'font-normal')}>
            {t('nav-bar.careers')}
          </NavigationMenuLink>
        </LocaleLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  }

  return (
    <NavigationMenu
      className={cn('flex h-full max-w-none justify-start', className)}
      viewportClassName="mt-0 broder-none rounded-none"
    >
      <div className="shrink-0 px-4">
        <LocaleLink href="/">
          <Image src="/assets/logo.svg" width={36} height={36} alt="muse logo"></Image>
        </LocaleLink>
      </div>
      {!hideMenu && (
        isEnterprisePage ? <div className='absolute left-1/2 flex h-[48px] -translate-x-1/2 items-center rounded-xl border border-[#D1D1CC] px-[10px]'>{renderMenus()}</div> : renderMenus()
      )}

      <div className="flex size-full flex-1 items-center justify-end gap-6">
        <LocaleSwitch />
        {isEnterprisePage ? <DarkButton className={'mr-5 h-[48px]'}>
          <Link
            href={user ? '/home' : '/auth'}
            prefetch={false}>
            <p className="hidden md:block">{user ? t('button.enter') : t('button.login')}</p>
          </Link>
        </DarkButton> : <Link
          href={user ? '/home' : '/auth'}
          prefetch={false}
          className="z-50 flex h-full w-[140px] items-center justify-center bg-black text-[14px] font-light leading-[22px] text-white transition duration-300 hover:bg-[#043FFB]"
        >
          <p className="hidden md:block">{user ? t('button.enter') : t('button.login')}</p>
        </Link>}
      </div>
    </NavigationMenu>
  )
}
