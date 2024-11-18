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

const heroData = {
  tag: 'Multiple Viewing',
  tagColor: '#E6F0FF',
  title: 'Unlock Versatile Viewing Modes for Future-Proof Productivity',
  description:
    "Enhance your project adaptability and workflow efficiency with MuseDAM's suite of advanced viewing modes. Our diverse viewing options ensure you have the perfect mode for every task, streamlining your productivity.",
}

const showcaseData: ShowcaseProps = {
  title: 'Maximize Efficiency with Advanced Viewing Modes',
  points: [
    {
      keyword: 'List View',
      description:
        'Embrace order with a crisp, table-driven display of your files and assets, where metadata details are effortlessly visible at a glance. Keep your progress and specifics managed with ease and clarity.',
    },
    {
      keyword: 'Kanban View',
      description:
        'Harness the efficiency of Kanban with a dynamic visual workflow that empowers you to prioritize tasks seamlessly and bring clarity to your project progression.',
    },
    {
      keyword: 'Waterfall View',
      description:
        'Experience a classic, sequential layout for previewing files and assets, offering you an authentic, true-to-scale view of your project stages.',
    },
    {
      keyword: 'Adaptive View',
      description:
        'Tailor your viewing experience to match your distinctive workflow with a flexible, adaptive mode designed to accommodate your precise needs.',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM: Optimize Project Management with Multi-View Capabilities',
  description: "Enhance Project Management with MuseDAM's Adaptive Views",
  points: [
    {
      keyword: 'View Customization',
      description:
        'Customize views for task management, progress tracking, and complex project oversight.',
    },
    {
      keyword: 'Multidimensional Insight',
      description: 'Achieve clear insights for decision-making from multiple perspectives.',
    },
    {
      keyword: 'Process Streamlining',
      description: 'Streamline workflows by choosing the best view for your tasks.',
    },
    {
      keyword: 'User-Friendly Interface',
      description: 'Benefit from a user-centric interface for effortless view transitions.',
    },
  ],
}

export default function MultipleViewingPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #ACCBEE 0%, #E7F0FD 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-center grid-cols-3 w-[640px] gap-[12.47px] px-6"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <MotionImage
              src="/Features/Multiple-Viewing/Multiple-Viewing1.png"
              width={188.78}
              height={387.95}
              alt="Multiple-Viewing1"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(1)}
            />
            <MotionImage
              src="/Features/Multiple-Viewing/Multiple-Viewing2.png"
              width={188.78}
              height={387.95}
              alt="Multiple-Viewing2"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/Multiple-Viewing/Multiple-Viewing3.png"
              width={188.78}
              height={387.95}
              alt="Multiple-Viewing3"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
            />
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}
