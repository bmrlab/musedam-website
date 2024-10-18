import SwiperBlock from '@/components/SwiperBlock'
import Hero from '@/components/LandingPage/Hero'
import SubscribeBlock from '@/components/LandingPage/Subscribe'

export default function LandingPage() {
  return (
    <div className="grid max-w-[1440px]">
      <Hero />
      <SubscribeBlock className="mt-[80px]" />
      <SwiperBlock />
    </div>
  )
}
