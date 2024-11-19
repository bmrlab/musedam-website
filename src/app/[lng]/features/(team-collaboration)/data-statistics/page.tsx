import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { tagColor } from '../const'
import PageClient from './page.client'
import { Metadata } from 'next'

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

export default function DataStatisticsPage() {
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
    title: 'MuseDAM | Data Statistics - Activity Rankings and Usage Logs',
    description:
      'MuseDAM offers comprehensive data statistics, including activity rankings for materials and members, as well as logs of operations, helping teams gain insights into material usage and member contributions, and improving the efficiency of resource management and team collaboration.',
  }
}
