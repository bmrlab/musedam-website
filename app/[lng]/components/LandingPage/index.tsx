import Hero from '@/[lng]/components/LandingPage/Hero'
import SubscribeBlock from '@/[lng]/components/LandingPage/Subscribe'
import { twx } from '@/lib/utils'
import Precept from '@/[lng]/components/LandingPage/Precept'
import SwiperBlock from '@/[lng]/components/LandingPage/SwiperBlock'

export default function LandingPage() {
  return (
    <div className="grid w-screen justify-items-center">
      <ContainerWithMaxWidth>
        <Hero />
      </ContainerWithMaxWidth>
      <SubscribeBlock className="mt-[80px] w-full" />
      <SwiperBlock />
      <Precept />
    </div>
  )
}

const ContainerWithMaxWidth = twx.div`max-w-[1440px]`
