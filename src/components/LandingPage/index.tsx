import Hero from '@/components/LandingPage/Hero'
import SubscribeBlock from './Subscribe'
import { twx } from '@/utilities/cn'
import Precept from '@/components/LandingPage/Precept'
import Highlights from '@/components/LandingPage/Highlights'

export default function LandingPage() {
  return (
    <div className="grid w-screen justify-items-center bg-white">
      <ContainerWithMaxWidth>
        <Hero />
      </ContainerWithMaxWidth>
      <SubscribeBlock className="mt-[60px] w-full md:mt-[80px]" />
      <Highlights />
      <Precept />
    </div>
  )
}

const ContainerWithMaxWidth = twx.div`overflow-x-scroll w-full md:max-w-[1440px]`
