'use client'

import { ComponentPropsWithoutRef, forwardRef } from 'react'
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
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

const IconWrapper: React.FC<LucideProps & { icon: React.ComponentType<LucideProps> }> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />
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
  return (
    <nav className="w-full bg-white relative border-b border-black h-[70px] flex items-center">
      <NavigationMenu
        className="h-full flex justify-start max-w-none"
        viewportClassName="mt-[1px] rounded-none shadow-[0px_2px_30px_2px_rgba(0,0,0,0.06)]"
      >
        <div className="flex-shrink-0 px-4">
          <Image src="/logo.svg" width={36} height={36} alt="muse logo"></Image>
        </div>
        <NavigationMenuList className="flex-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                style={{
                  background: 'linear-gradient(180deg, #F5F6F8 -1.99%, #E5F0FE 98.76%)',
                }}
                className="px-[100px] py-[80px] grid grid-cols-3 w-screen "
              >
                {features.map(f => (
                  <NavigationListItem {...f} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Customers</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                style={{
                  background: 'linear-gradient(180deg, #F5F6F8 -1.99%, #E5F0FE 98.76%)',
                }}
                className="px-[100px] py-[80px] grid grid-cols-3 w-screen "
              >
                {features.map(f => (
                  <NavigationListItem {...f} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                ️Why Muse?
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Resources
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <div className="flex-1 size-full flex justify-end">
          <button className=" w-[140px] h-full bg-[#043FFB] text-white text-[16px] leading-[22px] font-normal">
            Login
          </button>
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
>(({ category, items, className, children, ...props }, ref) => {
  // @ts-ignore
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
          <div className="text-sm font-normal text-[14px] leading-4 text-black/40">{category}</div>
          <div className="flex flex-col gap-[30px] pt-[30px]">
            {items.map(item => (
              <div
                key={item.title}
                className="flex gap-6 hover:text-accent-foreground focus:bg-accent transition-colors focus:text-accent-foreground items-center"
              >
                <IconWrapper icon={item.icon} size={20} />
                <div className="flex flex-col gap-2">
                  <div className="text-[16px] leading-[16px] font-medium">{item.title}</div>
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
