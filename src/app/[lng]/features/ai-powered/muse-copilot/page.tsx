import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'

const heroData = {
  tag: 'MuseCopilot',
  title: 'Your AI-Assistant for Creative Success',
  description:
    'Unlock the full potential of your creativity with MuseCopilot. Easily interact with your assets, get smart analysis, and have content crafted from your files. Find assets with intuitive semantic search and let MuseCopilot elevate your marketing strategies.',
}

const showcaseData: ShowcaseProps = {
  image: '/Features/AI-Powered/MuseCopilot-Hero.png',
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
      <Showcase {...showcaseData}></Showcase>
    </div>
  )
}
