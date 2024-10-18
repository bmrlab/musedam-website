import SwiperBlock from '@/components/SwiperBlock'
import Hero from '@/components/LandingPage/Hero'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { twx } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="grid w-screen justify-items-center">
      <ContainerWithMaxWidth>
        <Hero />
      </ContainerWithMaxWidth>
      <SubscribeBlock className="mt-[80px] w-full" />
      <SwiperBlock />
    </div>
  )
}

const ContainerWithMaxWidth = twx.div`max-w-[1440px]`
