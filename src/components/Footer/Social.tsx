import Link from 'next/link'
import Icons from '@/components/icon'
import { useLanguage } from '@/providers/Language'
import Image from 'next/image'


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
    cardUrl: '/weChat-official-account.jpeg',
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
  cardUrl
}: {
  label: string
  href?: string
  cardUrl?: string
  icon: React.ReactNode
}) => {
  return (
    <div className="group relative flex items-center gap-1.5 overflow-visible">
      {cardUrl &&
        <div className='absolute inset-x-[-20px] top-[-166px] size-[151px] overflow-hidden rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100'
          style={{
            boxShadow: '0px 4px 30px 4px #00000014'
          }}>
          <Image
            src={cardUrl}
            width={151}
            height={151}
            alt="Inspiration-Collection-Discord"
            className="size-[151px]"
          />
        </div>}
      <Link href={href ?? ''} target="_blank" >
        <p className="flex items-center gap-1.5">
          {icon}
          <span className="font-mono text-[14px] font-normal leading-[18.2px] text-[#141414]">
            {label}
          </span>
        </p>
      </Link>
    </div>
  )
}
