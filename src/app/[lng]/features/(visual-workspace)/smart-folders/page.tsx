import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { Metadata } from 'next'
import PageClient from './page.client'

const heroData = {
  tag: 'Smart Folders',
  tagColor: '#E6F0FF',
  title: 'Smart Folders: Automating File Organization',
  description:
    'Eliminate the complexity of file organization with Smart Folders, a groundbreaking solution that streamlines your digital workflow. Automatically categorize and manage your files with precision, tailored to your specific needs and preferences. 🚀',
}

const showcaseData: ShowcaseProps = {
  title: 'Simplify File Management with Intelligent Automation',
  points: [
    {
      keyword: 'Create Custom Smart Folders',
      description:
        'Easily create personalized Smart Folders that intelligently sort and categorize your files based on your unique criteria, streamlining your digital asset management.',
    },
    {
      keyword: 'Set-and-Forget Convenience',
      description:
        'Configure your preferences once, and let Smart Folders automatically keep your files organized and up-to-date in the background, saving you time and effort.',
    },
    {
      keyword: 'Real-Time Updates',
      description:
        'Gain confidence with real-time updates in your Smart Folders, ensuring that your files remain organized and synchronized as you work.',
    },
    {
      keyword: 'Innovation',
      description:
        "Unlock precision and customization with Smart Folders' advanced filtering options, including color, size, file format, tags, and creation date, for tailored file organization.",
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM Smart Folders: Elevate Your File Management Efficiency',
  description: "Accelerate Productivity with MuseDAM's Smart Folders",
  points: [
    {
      keyword: 'Automated File Sorting',
      description: 'Automate file sorting to save time and prioritize core tasks.',
    },
    {
      keyword: 'Customized File Management',
      description: 'Customize file management with advanced filtering for precision organization.',
    },
    {
      keyword: 'Adaptable to File Growth',
      description: 'Scale with your growing file collection while maintaining accessibility.',
    },
    {
      keyword: 'Intuitive Operational Experience',
      description:
        'Enjoy an intuitive setup and use for a user-friendly file organization experience.',
    },
  ],
}

export default function SmartFoldersPage() {
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
    title: 'MuseDAM | Smart Folders - Automatic Classification for Efficient Management',
    description:
      "MuseDAM's Smart Folders allow users to automatically categorize materials based on specific criteria, achieving efficient management and rapid retrieval of materials, enhancing the convenience and intelligence of creative work.",
  }
}
