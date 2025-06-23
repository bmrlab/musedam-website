import { twx } from '@/utilities/cn'

import { PropsWithLng } from '@/types/page'
import Hero from './Hero'
import Highlights from '@/components/LandingPage/Highlights'
import Precept from '@/components/LandingPage/Precept'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import AINatives from './AINatives'
import WhyMuse from './WhyMuse'

export default async function EnterpriseLandingPage({ params }: PropsWithLng) {
    const { lng } = await params
    return (
        <div className="grid w-screen justify-items-center bg-[#070707] text-white">
            <ContainerWithMaxWidth>
                <Hero lng={lng} />
            </ContainerWithMaxWidth>
            <AINatives />
            <ContainerWithMaxWidth>
                <WhyMuse />
            </ContainerWithMaxWidth>
            <Precept />
        </div>
    )
}

const ContainerWithMaxWidth = twx.div`overflow-x-scroll w-full md:max-w-[1440px]`
