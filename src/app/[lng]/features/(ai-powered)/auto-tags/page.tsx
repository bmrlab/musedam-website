import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { tagColor } from '../const'
import PageClient from './page.client'
import { Metadata } from 'next'

const heroData = {
  tag: 'Auto Tags',
  tagColor,
  title: 'Intelligent Tagging: Simplify and Personalize',
  description:
    "MuseDAM's Auto Tags use AI to automatically categorize your assets with smart tags that understand your content. Say goodbye to manual tagging and discover the power of customized, efficient searches that enhance your brand's workflow.",
}

const showcaseData: ShowcaseProps = {
  title: 'Efficient Asset Management: Simplified',
  description:
    'Break free from traditional folder hierarchies. Discover your content in a single, streamlined step.',
  points: [
    {
      keyword: 'Content Recognition',
      description:
        'Our AI swiftly identifies and labels your images, making them searchable with ease.',
    },
    {
      keyword: 'Clustering',
      description: 'Automatically gather similar assets into well-organized collections.',
    },
    {
      keyword: 'Searchability',
      description: 'Find assets instantly, saving time and increasing productivity.',
    },
    {
      keyword: 'Customization',
      description: 'Tailor tags to your workflow by editing AI suggestions or adding your own.',
    },
    {
      keyword: 'Integration',
      description:
        'Seamlessly blend intelligent tagging into your processes for a more efficient asset management system.',
    },
  ],
}

export default function AutoTagsPage() {
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
    title: 'MuseDAM | AI Tags - Automatic Tagging for Smart Retrieval',
    description:
      "MuseDAM's AI Tags feature automatically assigns accurate tags to materials, greatly improving retrieval efficiency and making digital asset management smarter and more efficient.",
  }
}