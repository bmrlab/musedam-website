import { HTMLAttributes, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { LucideProps } from 'lucide-react'

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
import { useHeaderTranslation } from '@/app/i18n/client'
import { MotionImage } from '@/components/StyleWrapper/image'

const DEFAULT_HERO_IMAGE = '/Navbar-Images/BMR-Logo.svg'

const IconWrapper: React.FC<LucideProps & { icon: React.ComponentType<LucideProps> }> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />
}

export default function HeaderDesktop({ className }: HTMLAttributes<HTMLDivElement>) {
  const { t } = useHeaderTranslation()
  const [currentHeroImage, setCurrentHeroImage] = useState<string>()
  const router = useRouter()

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
  return (
    <NavigationMenu
      className={cn('flex h-full max-w-none justify-start', className)}
      viewportClassName="mt-[1px] rounded-none shadow-[0px_2px_30px_2px_rgba(0,0,0,0.06)]"
    >
      <div className="shrink-0 px-4">
        <Link href="/">
          <Image src="/logo.svg" width={36} height={36} alt="muse logo"></Image>
        </Link>
      </div>
      <NavigationMenuList className="hidden flex-1 md:flex">
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t('nav-bar.features')}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid h-full w-screen grid-cols-3">
              <ul className="col-span-2 grid w-full grid-cols-3 gap-x-[20px] gap-y-[15px] p-[60px]">
                {categories.map((category, i) => (
                  <motion.div
                    key={i}
                    className="text-[14px] font-normal leading-4 text-black/40"
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
                    <Link href={data.url ?? ''} legacyBehavior passHref>
                      <NavigationMenuLink asChild>
                        <a
                          className={cn(
                            'block cursor-pointer select-none space-y-1 rounded-md py-3 leading-none no-underline outline-none',
                          )}
                        >
                          <div
                            key={data.title}
                            className="flex items-center gap-6 transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <IconWrapper icon={data.icon} size={20} className="self-start" />
                            <div className="flex flex-col gap-2">
                              <div className="underline-animation text-[16px] font-medium leading-[16px] group-hover:after:w-full">
                                {data.title}
                              </div>
                              <div className="text-[13px] leading-[19.5px] text-black/60">
                                {data.description}
                              </div>
                            </div>
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </Link>
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
                        alt="hero image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      />
                    </div>
                  ) : (
                    <div className="flex size-full items-end justify-center pb-[70px]">
                      <MotionImage
                        src={DEFAULT_HERO_IMAGE}
                        width={327}
                        height={286}
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
                          duration: 0.5,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about-us" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t('nav-bar.about-us')}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/careers" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {t('nav-bar.careers')}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="flex size-full flex-1 justify-end">
        <button
          className="z-50 h-full w-[140px] bg-black text-[16px] font-normal leading-[22px] text-white transition duration-300 hover:bg-[#043FFB]"
          onClick={() => {
            router.push(MUSEDAM_LOGIN_URL)
          }}
        >
          <p className="hidden md:block">{t('button.login')}</p>
        </button>
      </div>
    </NavigationMenu>
  )
}
