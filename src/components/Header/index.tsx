'use client'

import { LucideProps, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'framer-motion'
import Icons from '@/components/icon'
import useIsMobile from '@/hooks/useIsMobile'
import { features } from '@/components/Header/mock'
import { useMenuAnimation } from '@/components/Header/useMenuAnimation'

const DEFAULT_HERO_IMAGE = '/bmr.svg'

const IconWrapper: React.FC<LucideProps & { icon: React.ComponentType<LucideProps> }> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />
}

export default function Header() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const scope = useMenuAnimation(isOpen)
  const [currentHeroImage, setCurrentHeroImage] = useState<string>()

  const categories = useMemo(() => features.map((f) => f.category), [])

  return (
    <nav className="relative flex h-[56px] w-full items-center border-b border-black bg-white md:h-[70px]">
      <NavigationMenu
        className="flex h-full max-w-none justify-start"
        viewportClassName="mt-[1px] rounded-none shadow-[0px_2px_30px_2px_rgba(0,0,0,0.06)]"
      >
        <div className="flex-shrink-0 px-4">
          <Image src="/logo.svg" width={36} height={36} alt="muse logo"></Image>
        </div>
        <NavigationMenuList className="hidden flex-1 md:flex">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent className="h-[576px]">
              <div className="grid h-full w-screen grid-cols-3">
                <ul className="col-span-2 grid w-full grid-cols-3 gap-x-[20px] gap-y-[15px] px-[60px] py-[60px]">
                  {categories.map((category, i) => (
                    <div
                      key={i}
                      className="text-[14px] text-sm font-normal leading-4 text-black/40"
                    >
                      {category}
                    </div>
                  ))}
                  {new Array(Math.max(...features.map((f) => f.items.length)))
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>
                        {new Array(3).fill(0).map((_, j) => {
                          const data = features[j].items[i]
                          if (!data) return <li key={j}></li>
                          return (
                            <li
                              key={j}
                              className="group"
                              onMouseOver={() => setCurrentHeroImage(data.heroImage ?? '')}
                              onMouseLeave={() => setCurrentHeroImage('')}
                            >
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
                                    <IconWrapper
                                      icon={data.icon}
                                      size={20}
                                      className="self-start"
                                    />
                                    <div className="flex flex-col gap-2">
                                      <div className="text-[16px] font-medium leading-[16px] group-hover:underline">
                                        {data.title}
                                      </div>
                                      <div className="text-[13px] leading-[19.5px] text-black/60">
                                        {data.description}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          )
                        })}
                      </div>
                    ))}
                </ul>
                <div
                  style={{
                    background: 'linear-gradient(180deg, #F5F6F8 -1.99%, #E5F0FE 98.76%)',
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
                          alt="bmr logo"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        />
                      </div>
                    ) : (
                      <Image
                        src={DEFAULT_HERO_IMAGE}
                        width={327}
                        height={286}
                        alt="bmr logo"
                        className="absolute bottom-[70px] left-1/2 translate-x-[-50%]"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Customers</NavigationMenuTrigger>
            <NavigationMenuContent></NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/public" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                ️Why Muse?
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/public" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/public" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Resources
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div ref={scope} className="flex size-full flex-1 justify-end">
          <MobileMenu />
          <motion.button
            layout
            className="z-50 h-full bg-[#043FFB] text-[16px] font-normal leading-[22px] text-white"
            initial={{ width: '140px' }}
            animate={{ width: isMobile ? '56px' : '140px' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="flex w-full justify-center md:hidden"
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="flex w-full justify-center md:hidden"
                >
                  <Icons.showMore />
                </motion.div>
              )}
            </AnimatePresence>
            <p className="hidden md:block">Login</p>
          </motion.button>
        </div>
      </NavigationMenu>
    </nav>
  )
}

function MobileMenu() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        background: 'white',
        paddingTop: '100px',
        transform: 'translateX(-100%)',
        willChange: 'transform',
      }}
    >
      <ul>
        <li>Portfolio</li>
        <li>About</li>
        <li>Contact</li>
        <li>Search</li>
      </ul>
    </nav>
  )
}

const MotionImage = motion.create(Image)
