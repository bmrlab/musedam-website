import { cn, twx } from '@/lib/utils'
import Image from 'next/image'
import { data } from '@/[lng]/components/LandingPage/Highlights/mock'

export default function HighlightsMobile() {
  return (
    <div className="grid w-full">
      {data.map((item, index) => (
        <div key={index}>
          <ImageBgDiv>
            <Image src={item.image} fill alt={item.title} className="object-contain" />
          </ImageBgDiv>
          <div className="flex flex-col items-center justify-center bg-white px-[30px] pb-[60px] pt-10">
            <h1 className="font-baskervville text-[38px] font-normal leading-[43.47px] text-[#141414]">
              {item.title}
            </h1>
            <div className="mt-6 text-left font-mono">
              {item.description.map((desc, index) => (
                <p
                  key={index}
                  className={cn(
                    'w-full text-[16px] font-light leading-[24px] text-[#141414]',
                    index >= 1 && 'pt-3',
                  )}
                >
                  {desc}
                </p>
              ))}
              {item.list && (
                <div className="pt-3">
                  <ul className="list-inside list-disc text-[16px] font-light leading-[24px] text-[#141414]">
                    {item.list?.map((list, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-black"></div>
                        {list}
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {item.point && (
                <div className="flex flex-col gap-3 pt-6">
                  {item.point?.map((point, index) => (
                    <div key={index} className="space-y-2">
                      {/* 圆点 */}
                      <h3 className="flex items-center gap-1.5 text-[16px] font-medium leading-[24px] text-[#141414]">
                        <div className="h-1 w-1 rounded-full bg-black"></div>
                        {point.title}
                      </h3>
                      <p className="text-[16px] font-light leading-[24px] text-[#141414]">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6">
              <button className="rounded-[8px] bg-black px-[52.5px] py-[17px] font-mono text-[16px] leading-5 text-white">
                Start for free
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const ImageBgDiv = twx.div`rounded-b-[30px] relative h-[338.75px] w-full px-[15px] py-20 bg-[linear-gradient(157.66deg,#D4D6EA_14.56%,#DBCCD5_31.62%,#FB9D70_94.18%)]`