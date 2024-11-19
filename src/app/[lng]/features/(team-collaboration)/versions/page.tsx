import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { tagColor } from '../const'
import PageClient from './page.client'
import { Metadata } from 'next'

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

export default function VersionsPage() {
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
    title: 'MuseDAM | Version Control - Historical Records, Traceable Anytime',
    description:
      'MuseDAM offers powerful version control capabilities, supporting multi-version storage and historical tracing of materials, allowing teams to easily manage design iterations, ensuring the continuity and integrity of creative work.',
  }
}
