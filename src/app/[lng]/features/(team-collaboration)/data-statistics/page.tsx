'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { tagColor } from '../const'

const heroData = {
  tag: 'Data Statistics',
  tagColor: tagColor,
  title: 'Optimize Asset Management with Data-Driven Intelligence',
  description:
    "Delve into detailed resource utilization and user interaction analytics, empowering content administrators to assess asset health and inform strategic decisions with MuseDAM's comprehensive data tools.",
}

const showcaseData: ShowcaseProps = {
  title: "Accelerate Decision-Making with MuseDAM's Data Statistics",
  points: [
    {
      keyword: 'Asset Health Analysis',
      description:
        'Uncover the vitality of your digital assets with comprehensive health analysis.',
    },
    {
      keyword: 'Asset-User Interaction Tracking',
      description: 'Illuminate the dynamics of asset-user interactions with detailed tracking.',
    },
    {
      keyword: 'Usage Pattern Monitoring',
      description: 'Analyze user engagement patterns for assets through comprehensive monitoring.',
    },
    {
      keyword: 'Efficient Time-Based Filtering',
      description: 'Streamline data analysis with efficient filtering across various time scales.',
    },
    {
      keyword: 'Extensive Core Operation Coverage',
      description: 'Capture over 60 critical actions for in-depth operational transparency.',
    },
    {
      keyword: 'Action Transparency',
      description: 'Track user operations to ensure the authorized handling of valuable assets.',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM Data Statistics: Empower Data-Driven Decisions',
  points: [
    {
      keyword: 'Unlock Hidden Insights',
      description: 'Delve into granular asset usage and engagement metrics for deeper insights.',
    },
    {
      keyword: 'Collaboration Access',
      description:
        '"Power Your Decisions" Leverage detailed analytics and logs for strategic, data-informed decision-making.',
    },
    {
      keyword: 'Time-Smart Analysis',
      description: 'Enhance productivity with efficient time-based data filtering capabilities.',
    },
    {
      keyword: 'Boost Team Performance',
      description:
        "Elevate your team's performance and asset management through data-driven strategies.",
    },
  ],
}

const ImageBasePath = '/Features/Data-Statistics'

export default function DataStatisticsPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #2B5876 0%, #4E4376 100%)',
          }}
        >
          <motion.div
            className="grid w-[640px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <RelativeContainer className="w-fit ml-[50px]">
              <MotionImage
                src={`${ImageBasePath}/Data-Statistics-List.png`}
                width={467}
                height={579}
                alt="Data-Statistics-List"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(1)}
              />
              <MotionShadowImage
                src={`${ImageBasePath}/Data-Statistics-Card.png`}
                width={335.9}
                height={100.47}
                alt="Data-Statistics-Card"
                className="absolute top-[255px] right-[-84.9px]"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
              />
            </RelativeContainer>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}
