import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { Metadata } from 'next'
import PageClient from './page.client'

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
        <PageClient />
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | Multiple Views - Kanban, List, Waterfall, Adaptive',
    description:
      'MuseDAM offers multiple viewing modes, including Kanban, list, waterfall, and adaptive layouts, to meet the needs of different users for material browsing and management, making digital asset management more flexible and efficient.',
  }
}
