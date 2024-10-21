import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import Icons from '@/components/icon'

const socialItem = [
  {
    label: 'Instagram',
    icon: <Icons.instagram />,
    href: 'https://www.instagram.com/',
  },
  {
    label: 'Twitter',
    icon: <Icons.twitter />,
    href: 'https://twitter.com/',
  },
  {
    label: 'LinkedIn',
    icon: <Icons.linkedin />,
    href: 'https://www.linkedin.com/',
  },
  {
    label: 'YouTube',
    icon: <Icons.youtube />,
    href: 'https://www.youtube.com/',
  },
]

export default function SocialWidget() {
  return (
    <div className="grid gap-4">
      {socialItem.map((item, index) => (
        <SocialItemView key={index} {...item} />
      ))}
    </div>
  )
}

const SocialItemView = ({
  label,
  icon,
  href,
}: {
  label: string
  href?: string
  icon: React.ReactNode
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <Link href={href ?? ''} target="_blank">
        <p className="flex items-center gap-1.5">
          {icon}
          <span className="text-[14px] font-normal leading-[18.2px] text-[#141414]">{label}</span>
        </p>
      </Link>
    </div>
  )
}
