import { Metadata } from 'next'

import { PropsWithLng } from '@/types/page'
import SubscribeBlock from '@/components/LandingPage/Subscribe'
import { FlexColContainer } from '@/components/StyleWrapper/container'

export default async function AllFeaturesPage({ params }: PropsWithLng) {
  const { lng } = await params
  return (
    <FlexColContainer className="w-full items-center">
      <div className="min-h-screen w-full bg-white pt-10">
        <div className="flex flex-col justify-start md:flex-row md:justify-between">
          <div className="w-full flex-1 px-[30px] md:w-[48%] md:px-0">
            <div className="relative w-full pt-[80%]">
              <div className="absolute left-0 top-0 w-4/5">
                <div className="w-full bg-joinBg1 bg-cover pt-[67%]"></div>
              </div>

              <div className="absolute bottom-0 right-0 w-[70%]">
                <div className="w-full border-l-[9px] border-t-[9px] border-solid border-white bg-joinBg2 bg-cover pt-[47%]"></div>
              </div>
            </div>
          </div>
          <div className="w-full px-[30px] py-8 md:w-[48%] md:py-[60px]">
            <div className="mx-auto w-full max-w-[450px] 2xl:max-w-[667px]">
              <h1 className="text-12 font-baskervville md:text-[68px]">Join us at Muse</h1>
              <h3 className="text-4 mb-10 font-mono font-light leading-6 text-[#141414]">
                It’s time to build & create 🧑‍💻
              </h3>

              <div className="max-w-[450px] space-y-2 font-mono text-[16px] font-light leading-6 tracking-[2%] text-[#141414]">
                <div className="font-medium leading-7">Hiring Full-Stack Engineers</div>
                <p className="">
                  {`Join our innovative team at Muse and contribute to the cutting-edge digital asset management solutions. We're hiring Full-Stack Engineers with strong coding skills.`}
                </p>
                <br />
                <p>
                  Apply now by sending your resume to{' '}
                  <a
                    type="em"
                    href="mailto:contact@musedam.cc"
                    className="font-medium underline hover:opacity-75"
                  >
                    contact@musedam.cc
                  </a>{' '}
                  for technical challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubscribeBlock lng={lng} className="w-full" />
    </FlexColContainer>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Muse | Join Our Team as a Full-Stack Engineer`,
    description: `Elevate your career with Muse. We're seeking a Full-Stack Engineer to innovate and enhance our digital asset management platform. Be part of a dynamic, global team shaping the future of content management.`,
  }
}
