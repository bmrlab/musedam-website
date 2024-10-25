'use client'

import {
  BarChart2,
  Bot,
  Eye,
  FileText,
  Folders,
  List,
  Lock,
  LucideProps,
  Search,
  Share2,
  Tags,
  Users,
  X,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentPropsWithoutRef, forwardRef, useEffect, useState } from 'react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { AnimatePresence, AnimationSequence, motion, stagger, useAnimate } from 'framer-motion'
import Icons from '@/components/icon'
import useIsMobile from '@/hooks/useIsMobile'

const IconWrapper: React.FC<LucideProps & { icon: React.ComponentType<LucideProps> }> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />
}

function useMenuAnimation(isOpen: boolean) {
  const [scope, animate] = useAnimate()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    if (!hasMounted) {
      // 标记组件已经挂载过一次，避免初始动画
      setHasMounted(true)
      return
    }

    const menuAnimations = isOpen
      ? [
          [
            'nav',
            { transform: 'translateX(0%)' },
            { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
          ],
          [
            'li',
            { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' },
            { delay: stagger(0.05), at: '-0.1' },
          ],
        ]
      : [
          [
            'li',
            { transform: 'scale(0.5)', opacity: 0, filter: 'blur(10px)' },
            { delay: stagger(0.05, { from: 'last' }), at: '<' },
          ],
          ['nav', { transform: 'translateX(100%)' }, { at: '-0.1' }],
        ]

    animate(menuAnimations as AnimationSequence)
  }, [animate, isOpen])

  return scope
}

const features: {
  category: string
  items: {
    icon: React.ComponentType<LucideProps>
    title: string
    description: string
  }[]
}[] = [
  {
    category: 'AI-Powered',
    items: [
      { icon: Search, title: 'AI Search', description: 'Visual Content Asset Search' },
      { icon: Zap, title: 'AI Parsing', description: 'Visuals, Color Schemes, Themes, etc.' },
      {
        icon: FileText,
        title: 'AI Content Creation',
        description: 'Craft Blog from Asset Insights',
      },
      { icon: Tags, title: 'Auto Tags', description: 'Auto-Tag for Search & Clustering' },
      { icon: Bot, title: 'MuseCopilot', description: 'Chat with Copilot on your Content' },
    ],
  },
  {
    category: 'Visual Workspace',
    items: [
      {
        icon: Share2,
        title: 'Inspiration Collection',
        description: 'Browser Plugin for Websites',
      },
      { icon: Folders, title: 'Smart Folders', description: 'Automatic Categorization' },
      { icon: Eye, title: '70+ File Formats', description: 'Online Preview for 70+ Formats' },
      {
        icon: List,
        title: 'Multiple Viewing',
        description: 'List, Board, Waterfall and Adaptive',
      },
      {
        icon: Lock,
        title: 'Encrypted Sharing',
        description: 'Set Expiry and Password for Sharing',
      },
    ],
  },
  {
    category: 'Team Collaboration',
    items: [
      { icon: Users, title: 'Team Management', description: 'Member and Department Management' },
      { icon: Lock, title: 'Permissions', description: 'Folder Permissions by Member Role' },
      { icon: FileText, title: 'Dynamic Feedback', description: 'Comments and Annotations' },
      { icon: List, title: 'Versions', description: 'Version Control and History Access' },
      {
        icon: BarChart2,
        title: 'Data Statistics',
        description: 'Activity Statistics and Leaderboards',
      },
    ],
  },
]

export default function Header() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const scope = useMenuAnimation(isOpen)
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
              <div className="flex h-full w-screen">
                <ul className="grid grid-cols-3 px-[60px] py-[60px]">
                  {features.map((f, i) => (
                    <NavigationListItem key={i} {...f} />
                  ))}
                </ul>
                <div
                  style={{
                    background: 'linear-gradient(180deg, #F5F6F8 -1.99%, #E5F0FE 98.76%)',
                  }}
                  className="relative h-full w-[490px]"
                >
                  <Image
                    src="/bmr.svg"
                    width={327}
                    height={286}
                    alt="bmr logo"
                    className="absolute bottom-[70px] left-1/2 translate-x-[-50%]"
                  />
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Customers</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                style={{
                  background: 'linear-gradient(180deg, #F5F6F8 -1.99%, #E5F0FE 98.76%)',
                }}
                className="grid w-screen grid-cols-3 px-[100px] py-[80px]"
              >
                {features.map(f => (
                  <NavigationListItem key={f.category} {...f} />
                ))}
              </ul>
            </NavigationMenuContent>
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

const NavigationListItem = forwardRef<
  React.ElementRef<'a'>,
  ComponentPropsWithoutRef<'a'> & {
    category: string
    items: {
      icon: React.ComponentType
      title: string
      description: string
    }[]
  }
>(({ category, items, className, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none',
            className,
          )}
          {...props}
        >
          <div className="text-[14px] text-sm font-normal leading-4 text-black/40">{category}</div>
          <div className="flex flex-col gap-[30px] pt-[30px]">
            {items.map(item => (
              <div
                key={item.title}
                className="flex items-center gap-6 transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <IconWrapper icon={item.icon} size={20} />
                <div className="flex flex-col gap-2">
                  <div className="text-[16px] font-medium leading-[16px]">{item.title}</div>
                  <div className="text-[13px] leading-[19.5px] text-black/60">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
NavigationListItem.displayName = 'NavigationListItem'

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
