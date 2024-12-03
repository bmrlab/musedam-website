import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import { useCountry } from '@/providers/Country'

import Icons from '@/components/icon'
import { useLanguage } from '@/providers/Language'

const socialItemAbroad = [
  {
    label: 'Instagram',
    icon: <Icons.instagram />,
    href: 'https://www.instagram.com/tezign.musedam/',
  },
  {
    label: 'Twitter',
    icon: <Icons.twitter />,
    href: 'https://x.com/MuseDam_Tezign',
  },
  {
    label: 'YouTube',
    icon: <Icons.youtube />,
    href: 'https://www.youtube.com/channel/UCg9jl7ItOcITphJevWm4jDg',
  },
]

const socialItemInChina = [
  {
    label: '公众号',
    icon: <Icons.weChat />,
    cardUrl: '/assets/weChat-official-account.jpeg',
  },
  {
    label: '小红书',
    icon: <Icons.redBook />,
    href: 'https://www.xiaohongshu.com/user/profile/5c84fc0500000000110254ae?xhsshare=CopyLink&appuid=5c84fc0500000000110254ae&apptime=1731427955&share_id=a14250ca90a74635ac41f6dfdbb9d5da',
  },
  {
    label: 'Bilibili',
    icon: <Icons.bilibili />,
    href: 'https://space.bilibili.com/690784968',
  },
]

export default function SocialWidget() {
  // const { isInChina } = useCountry()
  const { language } = useLanguage()
  const socialItem = language === 'zh' ? socialItemInChina : socialItemAbroad
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
  cardUrl,
}: {
  label: string
  href?: string
  cardUrl?: string
  icon: React.ReactNode
}) => {
  const Wrapper = href ? (props) => <Link href={href} target="_blank" {...props} /> : Fragment

  return (
    <div className="group relative flex w-fit items-center gap-1.5 overflow-visible">
      {cardUrl && (
        <div
          className="pointer-events-none absolute inset-x-[-20px] top-[-166px] size-[151px] overflow-hidden rounded-md opacity-0 transition-opacity duration-300 group-hover:animate-fade-in-up group-hover:opacity-100"
          style={{
            boxShadow: '0px 4px 30px 4px #00000014',
          }}
        >
          <Image
            src={cardUrl}
            width={151}
            height={151}
            alt="Inspiration-Collection-Discord"
            className="size-[151px]"
          />
        </div>
      )}
      <Wrapper>
        <p className="flex cursor-pointer items-center gap-1.5">
          {icon}
          <span className="underline-animation font-mono text-[14px] font-normal leading-[18.2px] text-[#141414] after:h-[1.5px]">
            {label}
          </span>
        </p>
      </Wrapper>
    </div>
  )
}
