import { usePreceptTranslation } from '@/app/i18n/client'

export type PreceptData = {
  avatar: string
  name: string
  role: string
  description: string[]
}

const AvatarPrefix = '/assets/Testimonial'

export default function usePreceptData() {
  const { t } = usePreceptTranslation()
  const data: PreceptData[] = [
    {
      avatar: `${AvatarPrefix}/Avatar1.png`,
      name: t('precept.card0.name'),
      role: t('precept.card0.role'),
      description: [
        t('precept.card0.description0'),
        t('precept.card0.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar2.png`,
      name: t('precept.card1.name'),
      role: t('precept.card1.role'),
      description: [
        t('precept.card1.description0'),
        t('precept.card1.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar3.png`,
      name: t('precept.card2.name'),
      role: t('precept.card2.role'),
      description: [
        t('precept.card2.description0'),
        t('precept.card2.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar4.png`,
      name: t('precept.card3.name'),
      role: t('precept.card3.role'),
      description: [
        t('precept.card3.description0'),
        t('precept.card3.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar5.png`,
      name: t('precept.card4.name'),
      role: t('precept.card4.role'),
      description: [
        t('precept.card4.description0'),
        t('precept.card4.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar6.png`,
      name: t('precept.card5.name'),
      role: t('precept.card5.role'),
      description: [
        t('precept.card5.description0'),
        t('precept.card5.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar7.png`,
      name: t('precept.card6.name'),
      role: t('precept.card6.role'),
      description: [
        t('precept.card6.description0'),
        t('precept.card6.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar8.png`,
      name: t('precept.card7.name'),
      role: t('precept.card7.role'),
      description: [
        t('precept.card7.description0'),
        t('precept.card7.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar9.png`,
      name: t('precept.card8.name'),
      role: t('precept.card8.role'),
      description: [
        t('precept.card8.description0'),
        t('precept.card8.description1'),
      ],
    },
    {
      avatar: `${AvatarPrefix}/Avatar10.png`,
      name: t('precept.card9.name'),
      role: t('precept.card9.role'),
      description: [
        t('precept.card9.description0'),
        t('precept.card9.description1'),
      ],
    },
  ]

  return { data }
}
