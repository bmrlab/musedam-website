import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { tagColor } from '../const'
import { Metadata } from 'next'
import PageClient from './page.client'

const heroData = {
  tag: 'MuseCopilot',
  tagColor,
  title: 'Your AI-Assistant for Creative Success',
  description:
    'Unlock the full potential of your creativity with MuseCopilot. Easily interact with your assets, get smart analysis, and have content crafted from your files. Find assets with intuitive semantic search and let MuseCopilot elevate your marketing strategies.',
}

const showcaseData: ShowcaseProps = {
  title: 'Creative Solutions at Your Command',
  points: [
    {
      keyword: 'Interactive Intelligence',
      description:
        "Engage directly with your assets and get smart parsing, summaries, and articles with MuseCopilot's user-friendly interface.",
    },
    {
      keyword: 'Semantic Search',
      description:
        'Effortlessly search your assets with natural language queries, like "Find astronaut PNGs."',
    },
    {
      keyword: 'Marketing Strategis',
      description:
        'MuseCopilot helps you craft tailored marketing and brand plans to meet your specific objectives.',
    },
    {
      keyword: 'Illustrations',
      description:
        'With a simple request, MuseCopilot generates custom illustrations, like a New Yorker-style Christmas theme, for your blog.',
    },
  ],
}

export default function AiPoweredPage() {
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
    title: 'MuseCopilot - AI-Powered Q&A and Content Creation',
    description:
      'MuseCopilot is an AI assistant that revolutionizes material management with integrated Q&A and content creation, significantly enhancing creativity and efficiency.',
  }
}
