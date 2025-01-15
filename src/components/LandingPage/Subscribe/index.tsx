import { draftMode } from 'next/headers'
import Link from 'next/link'
import { MUSEDAM_LOGIN_URL } from '@/constant/url'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import SubscribeForm from '@/components/LandingPage/Subscribe/form'
import { FadeInUpContainer } from '@/components/StyleWrapper/Container/AnimationContainer'
import { HoverTranslateXArrowRight } from '@/components/StyleWrapper/icon'
import { ssTranslation } from '@/app/i18n'

export default async function SubscribeBlock({
  lng,
  className,
}: {
  lng: string
  className?: string
}) {
  const { t } = await ssTranslation(lng, 'landing-page')
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'forms',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      title: {
        equals: 'Subscribe Form',
      },
    },
  })

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-[30px] bg-[rgb(237,237,237)] px-6 py-[60px] md:px-0',
        className,
      )}
    >
      <FadeInUpContainer>
        <h2 className="text-center font-euclid  text-[32px] font-normal leading-[43.47px]  md:text-left md:text-[48px] md:leading-[54.91px]">
          {t('subscribe.title')}
        </h2>
      </FadeInUpContainer>
      <SubscribeForm form={docs?.[0]} />
      <div className="flex max-w-[270px] flex-wrap justify-center gap-2 font-mono text-[14px] font-light leading-[28px] tracking-[1%] md:max-w-none">
        <span className="text-nowrap">{t('subscribe.join')} </span>
        <Link href={MUSEDAM_LOGIN_URL} prefetch={false}>
          <div className="group flex h-full items-center gap-2">
            <span className="underline-animation flex cursor-pointer  items-center gap-2">
              {t('subscribe.free-trial')}
            </span>
            <HoverTranslateXArrowRight className="size-3" />
          </div>
        </Link>
      </div>
    </div>
  )
}
