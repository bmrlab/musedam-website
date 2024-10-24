import Hero from '@/[lng]/components/LandingPage/Hero'
import SubscribeBlock from '@/[lng]/components/Subscribe'
import { twx } from '@/lib/utils'
import Index from '@/[lng]/components/LandingPage/Precept'
import SwiperBlock from "@/[lng]/components/LandingPage/Highlights";

export default function LandingPage() {
  return (
    <div className="grid w-screen justify-items-center">
      <ContainerWithMaxWidth>
        <Hero />
      </ContainerWithMaxWidth>
      <SubscribeBlock className="mt-[80px] w-full" />
      <SwiperBlock />
      <Index />
    </div>
  )
}

const ContainerWithMaxWidth = twx.div`max-w-[1440px]`
