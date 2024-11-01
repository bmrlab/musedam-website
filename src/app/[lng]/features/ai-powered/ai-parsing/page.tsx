import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'

const heroData = {
  tag: 'AI Parsing',
  title: 'Deep Dive into Your Assets with AI Parsing',
  description:
    "MuseDAM's AI Parsing technology goes deep to unlock the full potential of your creative assets. It analyzes images beyond basic tags, uncovering detailed insights into content, colors, mood, and more. This intelligence empowers you to search and find the perfect asset for your project with remarkable speed and precision.",
}

const showcaseData: ShowcaseProps = {
  image: '/Features/AI-Powered/AI-Parsing-Hero.png',
  title: 'Streamlined Search for Your Creative Workflow',
  description:
    "By harnessing MuseDAM's intelligent analysis, you revolutionize the way you interact with your assets, achieving unprecedented detail and efficiency in managing and utilizing your creative resources.",
  points: [
    {
      keyword: 'Content Analysis',
      description:
        "Uncover the essence of your images with MuseDAM's intelligent technology, dissecting scenes, subjects, and context into actionable search data that meets your creative requirements.",
    },
    {
      keyword: 'Color',
      description:
        "Match your vision with assets that fit your color palette, leveraging our technology's ability to recognize and categorize color schemes within images.",
    },
    {
      keyword: 'Mood',
      description:
        'Select assets that resonate with the emotional tone of your project, with our system identifying mood and atmosphere.',
    },
  ],
}

export default function AiParsingPage() {
  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}></Showcase>
    </div>
  )
}
