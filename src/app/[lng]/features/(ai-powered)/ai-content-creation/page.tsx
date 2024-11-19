import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { tagColor } from '../const'
import PageClient from './page.client'
import { Metadata } from 'next'

const heroData = {
  tag: 'AI Content Creation',
  tagColor,
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
  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <PageClient />
      </Showcase>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'MuseDAM | AI Content Creation - Intelligent Summarization and Article Generation',
    description:
      "MuseDAM's AI Content Creation feature intelligently summarizes material content and even writes new articles based on it, greatly improving the efficiency and quality of creative work.",
  }
}
