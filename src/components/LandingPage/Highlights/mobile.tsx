import { cn, twx } from '@/utilities/cn'

import {
  AIGenerateImageGroup,
  CollaborateImageGroup,
  CollectImageGroup,
  OrganizeImageGroup,
} from '@/components/LandingPage/Highlights/image-group'
import { Highlight } from '@/components/LandingPage/Highlights/index'
import { useHighlightTranslation } from '@/app/i18n/client'

export default function HighlightsMobile({ data }: { data: Highlight[] }) {
  const { t } = useHighlightTranslation()
  return (
    <div className="grid w-full">
      {data.map((item, index) => (
        <div key={index} style={{ background: item.bgColor }}>
          <ImageBgDiv className="flex items-center justify-center">
            {(() => {
              switch (item.key) {
                case 'collect':
                  return <CollectImageGroup isBuildFinished={() => true} />
                case 'organize':
                  return (
                    <OrganizeImageGroup
                      className="items-center justify-center"
                      isBuildFinished={() => true}
                    />
                  )
                case 'collaborate':
                  return (
                    <CollaborateImageGroup
                      className="h-[258.75px] items-center justify-start"
                      isBuildFinished={() => true}
                    />
                  )
                case 'ai-generate':
                  return <AIGenerateImageGroup isBuildFinished={() => true} />
              }
            })()}
          </ImageBgDiv>
          <div className="flex flex-col items-center justify-center px-[30px] pb-[60px] pt-10">
            <h1 className="font-baskervville text-[38px] font-normal leading-[43.47px] text-[#141414]">
              {item.title}
            </h1>
            <div className="mt-6 flex flex-col gap-3 text-left font-mono text-[14px]">
              {item.description.map((desc, index) => (
                <p key={index} className={'w-full font-light leading-[26px] text-[#141414]'}>
                  {desc}
                </p>
              ))}
              {item.list && (
                <div>
                  <ul className="list-inside list-disc font-light leading-[24px] text-[#141414]">
                    {item.list?.map((list, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="size-1 rounded-full bg-black"></div>
                        {list}
                      </div>
                    ))}
                  </ul>
                </div>
              )}
              {item.point && (
                <div className="flex flex-col gap-3">
                  {item.point?.map((point, index) => (
                    <div key={index} className="space-y-2">
                      {/* 圆点 */}
                      <h3 className="flex items-center gap-1.5 font-medium leading-[24px] text-[#141414]">
                        <div className="size-1 rounded-full bg-black"></div>
                        {point.title}
                      </h3>
                      <p className="font-light leading-[24px] text-[#141414]">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6">
              <button className="rounded-[8px] bg-black px-[52.5px] py-[17px] font-mono text-[16px] leading-5 text-white">
                {t('highlight.button')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const ImageBgDiv = twx.div`relative h-[338.75px] w-full px-[15px]`
