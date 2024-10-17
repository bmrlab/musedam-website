'use client'

import { ComponentPropsWithoutRef, forwardRef, useState } from 'react'
import Image from 'next/image'
import {
  Search,
  Zap,
  FileText,
  Tags,
  Bot,
  Share2,
  BarChart2,
  Users,
  Lock,
  Eye,
  Folders,
  List,
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Header() {
  const features = [
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

  return (
    <nav className="w-full bg-white relative border-b border-black h-[70px] flex items-center">
      <NavigationMenu
        className="h-full flex justify-start max-w-none"
        viewportClassName="mt-[1px] rounded-none"
      >
        <div className="flex-shrink-0 pl-4">
          <Image src="/logo.svg" width={36} height={36} alt="muse logo"></Image>
        </div>
        <NavigationMenuList className="flex-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-screen">
                <ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Customers</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-screen">
                {features.map(component => (
                  <ListItem key={component.category} title={component.category} href="">
                    {component.items.map(item => (
                      <ListItem key={item.title} title={item.title}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ListItem>
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

const ListItem = forwardRef<React.ElementRef<'a'>, ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'
