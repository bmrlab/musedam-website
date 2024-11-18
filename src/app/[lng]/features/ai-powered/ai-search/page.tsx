'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'

const heroData = {
  tag: 'AI Search',
  tagColor: '#E8E1FE',
  title: 'Unleash Your Creativity with Smart Search',
  description:
    'Discover a search experience that understands your creative vision. Our AI-enhanced Smart Search allows you to effortlessly find the exact asset you need by recognizing images and suggesting intuitive keywords.',
}

const showcaseData: ShowcaseProps = {
  title: 'Streamlined Search for Your Creative Workflow',
  description:
    'Break free from traditional folder hierarchies. Discover your content in a single, streamlined step.',
  points: [
    {
      keyword: 'Keywords',
      description:
        'Unlock the power of AI to automatically tag every image with context-rich keywords like "portrait", "vibrant", "urban landscape" upon upload, making your search effortless and precise.',
    },
    {
      keyword: 'Tags',
      description:
        'Customize your asset library with personalized tags, turning your workspace into a searchable encyclopedia of your creative endeavors.',
    },
    {
      keyword: 'Metadata',
      description:
        'Quickly retrieve that specific photo from a past project by searching with pinpoint accuracy by date, uploader, resolution, and other metadata.',
    },
    {
      keyword: 'Intelligent Filters',
      description:
        'Supercharge your search with filters that let you sort through your workspace or a specific board by color, file type, tags, source link, or uploader. Save time with Saved Filters, creating dynamic collections that update automatically, ensuring you always have swift access to the content that matters most.',
    },
  ],
}

export default function AiSearchPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #9DAFC7 0%, #C3CFE8 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-center w-[640px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <div className="flex justify-between w-full pl-[53px] pr-[47.17px]">
              <MotionShadowImage
                src="/Features/AI-Search/AI-Search-Tags.png"
                width={229}
                height={31}
                alt="AI-Search-Tags"
                onAnimationComplete={() => handleAnimationComplete(1)}
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <MotionImage
                src="/Features/AI-Search/AI-Search-Input.png"
                width={222.83}
                height={35}
                alt="AI-Search-Input"
                className="drop-shadow-[0px_0px_0px_2px_#3366FF33]"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </div>
            <RelativeContainer className="mt-[37.5px]">
              <MotionImage
                src="/Features/AI-Search/AI-Search-Images.png"
                width={456.8}
                height={471.61}
                alt="AI-Search-Images"
                initial={{ y: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
              <MotionShadowImage
                src="/Features/AI-Search/AI-Search-Color.png"
                width={174.11}
                height={125}
                alt="AI-Search-Color.png"
                className="absolute bottom-[35.61px] right-[-71.31px]"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
              />
            </RelativeContainer>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <FamousQuotes className="h-[800px]" />
      <MoreFeatures
        features={[
          FeaturesEnum.AIParsing,
          FeaturesEnum.ContentCreation,
          FeaturesEnum.AutoTags,
          FeaturesEnum.MuseCopilot,
        ]}
      />
    </div>
  )
}
