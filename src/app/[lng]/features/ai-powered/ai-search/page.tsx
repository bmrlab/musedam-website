import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'

const heroData = {
  tag: 'AI Search',
  title: 'Unleash Your Creativity with Smart Search',
  description:
    'Discover a search experience that understands your creative vision. Our AI-enhanced Smart Search allows you to effortlessly find the exact asset you need by recognizing images and suggesting intuitive keywords.',
}

const showcaseData: ShowcaseProps = {
  image: '/Features/AI-Powered/AI-Search-Hero.png',
  title: 'Streamlined Search for Your Creative Workflow',
  description:
    'Break free from traditional folder hierarchies. Discover your content in a single, streamlined step.',
  points: [
    {
      keyword: 'Keywords',
      description:
        'Unlock the power of AI to automatically tag every image with context-rich keywords like "portrait", "vibrant", "urban landscape" upon upload, making your search effortless and precise.',
    },
    {
      keyword: 'Tags',
      description:
        'Customize your asset library with personalized tags, turning your workspace into a searchable encyclopedia of your creative endeavors.',
    },
    {
      keyword: 'Metadata',
      description:
        'Quickly retrieve that specific photo from a past project by searching with pinpoint accuracy by date, uploader, resolution, and other metadata.',
    },
    {
      keyword: 'Intelligent Filters',
      description:
        'Supercharge your search with filters that let you sort through your workspace or a specific board by color, file type, tags, source link, or uploader. Save time with Saved Filters, creating dynamic collections that update automatically, ensuring you always have swift access to the content that matters most.',
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
