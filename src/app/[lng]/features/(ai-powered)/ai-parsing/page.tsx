'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { tagColor } from '../const'

const heroData = {
  tag: 'AI Parsing',
  tagColor,
  title: 'Deep Dive into Your Assets with AI Parsing',
  description:
    "MuseDAM's AI Parsing technology goes deep to unlock the full potential of your creative assets. It analyzes images beyond basic tags, uncovering detailed insights into content, colors, mood, and more. This intelligence empowers you to search and find the perfect asset for your project with remarkable speed and precision.",
}

const showcaseData: ShowcaseProps = {
  title: 'Streamlined Search for Your Creative Workflow',
  description:
    "By harnessing MuseDAM's intelligent analysis, you revolutionize the way you interact with your assets, achieving unprecedented detail and efficiency in managing and utilizing your creative resources.",
  points: [
    {
      keyword: 'Content Analysis',
      description:
        "Uncover the essence of your images with MuseDAM's intelligent technology, dissecting scenes, subjects, and context into actionable search data that meets your creative requirements.",
    },
    {
      keyword: 'Color',
      description:
        "Match your vision with assets that fit your color palette, leveraging our technology's ability to recognize and categorize color schemes within images.",
    },
    {
      keyword: 'Mood',
      description:
        'Select assets that resonate with the emotional tone of your project, with our system identifying mood and atmosphere.',
    },
  ],
}

export default function AiParsingPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #FEEBE2 0%, #C2BEFF 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-center w-[640px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <RelativeContainer>
              <MotionImage
                src="/Features/AI-Parsing/AI-Parsing-Images.png"
                width={478.8}
                height={517.51}
                alt="AI-Parsing-Images"
                initial={{ y: '10%', opacity: 0 }}
                animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(1)}
              />
              <MotionShadowImage
                src="/Features/AI-Parsing/AI-Parsing-Star.png"
                width={24}
                height={20}
                alt="AI-Parsing-Star"
                className="absolute bottom-[14.51px] right-[15.8px]"
                initial={{ opacity: 0 }}
                animate={isBuildFinished(1) ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(2)}
              />
              <MotionShadowImage
                src="/Features/AI-Parsing/AI-Parsing-Summarization.png"
                width={312}
                height={288}
                alt="AI-Parsing-Summarization"
                className="absolute bottom-[39.51px] right-[16.8px]"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              />
            </RelativeContainer>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
    </div>
  )
}
