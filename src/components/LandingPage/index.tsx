import { twx } from '@/utilities/cn'

import { PropsWithLng } from '@/types/page'
import Hero from '@/components/LandingPage/Hero'
import Highlights from '@/components/LandingPage/Highlights'
import Precept from '@/components/LandingPage/Precept'
import SubscribeBlock from '@/components/LandingPage/Subscribe'

export default async function LandingPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <div className="grid w-screen justify-items-center bg-white">
      <ContainerWithMaxWidth>
        <Hero lng={lng} />
      </ContainerWithMaxWidth>
      <SubscribeBlock lng={lng} className="mt-[60px] w-full md:mt-[80px]" />
      <Highlights />
      <Precept />
    </div>
  )
}

const ContainerWithMaxWidth = twx.div`overflow-x-scroll w-full md:max-w-[1440px]`
