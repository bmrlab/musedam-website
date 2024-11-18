'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { tagColor } from '../const'

const heroData = {
  tag: 'Versions',
  tagColor: tagColor,
  title: 'Streamline Asset Management and Version Tracking',
  description:
    "Govern the lifecycle of your digital assets with MuseDAM's Versions feature, ensuring precise control over asset evolution and team collaboration.",
}

const showcaseData: ShowcaseProps = {
  title: 'Optimize Creative Workflows with Version Management',
  points: [
    {
      keyword: 'Multi-Version Support',
      description:
        'Manage multiple versions of a single asset with distinct metadata for precise version differentiation.',
    },
    {
      keyword: 'Historical Task Storage and Management',
      description:
        'Effortlessly store and manage historical tasks, ensuring a clear audit trail for asset development.',
    },
    {
      keyword: 'Version Indicators on Thumbnails',
      description:
        'Quickly identify the latest and previous versions with clear indicators on asset thumbnails.',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM Versions: Simplify Version Control for Enhanced Creative Workflows',
  points: [
    {
      keyword: 'Version Clarity',
      description:
        'Maintain organizational clarity with precise version tracking and robust metadata management.',
    },
    {
      keyword: 'Collaboration Access',
      description:
        'Boost collaboration efficiency by simplifying access to various asset versions.',
    },
    {
      keyword: 'Workflow Visuals',
      description: 'Improve workflow speed with visual cues on thumbnails for version updates.',
    },
    {
      keyword: 'Creative Acceleration',
      description:
        "Accelerate your team's creative process with MuseDAM's Versions feature, ensuring confident and efficient asset management.",
    },
  ],
}

const ImageBasePath = '/Features/Versions'

export default function VersionsPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #CCD8E4 0%, #FFFFFF 100%)',
          }}
          className="py-10"
        >
          <motion.div
            className="grid w-[640px] justify-center py-[70px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <MotionImage
              src={`${ImageBasePath}/Versions1.png`}
              width={457}
              height={385.88}
              alt="Versions1"
              initial={{ y: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(1)}
            />
            <div className="flex gap-[13.24px] mt-[18px]">
              <MotionImage
                src={`${ImageBasePath}/Versions2.png`}
                width={96.31}
                height={96.31}
                alt="Versions2"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              />
              <MotionImage
                src={`${ImageBasePath}/Versions3.png`}
                width={138.45}
                height={95.11}
                alt="Versions3"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
      <FamousQuotes className="h-[800px]" />
      <MoreFeatures
        features={[
          FeaturesEnum.Team,
          FeaturesEnum.Permissions,
          FeaturesEnum.Feedback,
          FeaturesEnum.DataStatistics,
        ]}
      />
    </div>
  )
}
