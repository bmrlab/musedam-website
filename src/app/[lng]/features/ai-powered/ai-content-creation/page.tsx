'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { FlexCenterContainer, FlexColContainer } from '@/components/StyleWrapper/container'
import { MotionImage } from '@/components/StyleWrapper/image'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'

const heroData = {
  tag: 'AI Content Creation',
  tagColor: '#E8E1FE',
  title: 'AI-Boosted Summaries & Storytelling',
  description:
    "MuseDAM's AI tools turbocharge your content strategy, swiftly summarizing assets and crafting stories that resonate. Generate articles and summaries instantly, cutting content creation time and prioritizing audience connection.",
}

const showcaseData: ShowcaseProps = {
  title: 'Unlock AI-Powered Content Efficiency and Innovation',
  points: [
    {
      keyword: 'Summarization',
      description:
        "MuseDAM's AI swiftly pinpoints the essence of your assets, delivering crisp summaries for swift decision-making.",
    },
    {
      keyword: 'Content Creation',
      description:
        'Our AI converts your data into engaging articles, saving you hours on writing and research, and keeping your content pipeline brimming with freshness.',
    },
    {
      keyword: 'Contextual Relevance',
      description:
        "Ensure content cohesion with brand messaging through our AI's contextual alignment, ensuring every narrative resonates with your audience.",
    },
    {
      keyword: 'Efficiency',
      description:
        'Streamline content production with AI drafts that reduce revisions, freeing you to focus on strategy and quality.',
    },
    {
      keyword: 'Innovation',
      description:
        'Stay ahead with AI insights that infuse your content with novel perspectives, securing your place at the cutting edge of innovation.',
    },
  ],
}

export default function AiContentCreationPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #C5EDF5 2.5%, #546498 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-center w-[640px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <FlexColContainer className="gap-[16.82px] w-[525.62px]">
              <MotionImage
                src="/Features/Content-Creation/Content-Creation1.png"
                width={474}
                height={223.3}
                alt="Content-Creation1"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(1)}
              />
              <MotionImage
                src="/Features/Content-Creation/Content-Creation2.png"
                width={196.35}
                height={47.69}
                alt="Content-Creation2"
                className="self-end"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(2)}
              />
              <MotionImage
                src="/Features/Content-Creation/Content-Creation3.png"
                width={474}
                height={297.88}
                alt="Content-Creation3"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </FlexColContainer>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <FamousQuotes className="h-[800px]" />
      <MoreFeatures
        features={[
          FeaturesEnum.AISearch,
          FeaturesEnum.AIParsing,
          FeaturesEnum.AutoTags,
          FeaturesEnum.MuseCopilot,
        ]}
      />
    </div>
  )
}
