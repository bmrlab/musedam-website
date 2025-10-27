import { twx } from '@/utilities/cn'

import { PropsWithLng } from '@/types/page'
import Hero from './Hero'
import AINatives from './AINatives'
import WhyMuse from './WhyMuse'
import Brands from './Brands'
import FAQ from '@/components/Pricing/Enterprise/FAQ'
import { Information } from '@/components/Pricing/Enterprise/information'

export default async function EnterpriseLandingPage({ params }: PropsWithLng) {
    return (
        <div className="flex w-screen flex-col items-center bg-[#070707] text-white">
            <ContainerWithMaxWidth>
                <Hero />
            </ContainerWithMaxWidth>
            <AINatives />
            <ContainerWithMaxWidth>
                <WhyMuse />
            </ContainerWithMaxWidth>
            <Brands />
            <FAQ />
            <Information from='home' />
        </div>
    )
}

const ContainerWithMaxWidth = twx.div`w-full md:max-w-[1440px]`
