import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { Metadata } from 'next'
import PageClient from './page.client'

const heroData = {
  tag: 'Inspiration Collection',
  tagColor: '#E6F0FF',
  title: 'AI-Powered Web Inspiration Collector ',
  description:
    'MuseDAM is the ultimate web browser extension for Chrome, Edge, and 360 browsers, designed to supercharge your digital asset management. Experience seamless creativity with our intuitive drag-and-drop feature, and effortlessly collect images, videos, and web pages. Join the AI era with MuseDAM, your go-to AI artwork asset library, ensuring efficient preservation of your digital inspirations.',
}

const showcaseData: ShowcaseProps = {
  title: 'Effortlessly Capture & Organize Web Content',
  points: [
    {
      keyword: 'Save Web Pages to MuseDAM',
      description:
        'Effortlessly bookmark and organize your favorite web pages in MuseDAM, granting you anytime, anywhere access to your digital inspirations.',
    },
    {
      keyword: 'Batch Collection',
      description:
        'Simplify your collection workflow with our innovative batch collection feature, allowing you to gather and organize multiple items swiftly, saving precious time and effort.',
    },
    {
      keyword: 'Area Selection Capture',
      description:
        "Capture only the desired sections of a webpage with MuseDAM's precise area selection tool, ensuring accurate and tailored captures every time.",
    },
    {
      keyword: 'Visible Area Capture',
      description:
        "Effortlessly grab the currently visible portion of any web page with MuseDAM's visible area capture feature, perfect for quick and efficient content saving.",
    },
    {
      keyword: 'Full Page Capture',
      description:
        "Capture the complete layout and content of any web page in a single operation with MuseDAM's full-page capture tool, eliminating the need for scrolling and stitching.",
    },
    {
      keyword: 'Collect Midjourney Works with Metadata',
      description:
        'Comprehensive Midjourney Collection with MuseDAMSave not just the artwork, but also the associated prompt words and original web page URLs, providing a holistic record of your creative inspiration. MuseDAM stands out as the ultimate asset library for AI creations in the AI era.✨',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM: The Ultimate Choice for Creative Digital Asset Management',
  description: "Unlock Efficiency with MuseDAM's Smart Digital Asset Management",
  points: [
    {
      keyword: 'Efficient Workflow Enhancement',
      description:
        'Streamline your creative workflow with time-saving tools designed for efficiency.',
    },
    {
      keyword: 'Versatile Role Adaptability',
      description:
        'Adapt to any role with versatile features for collecting and organizing digital assets.',
    },
    {
      keyword: 'User-Centric Interface Design',
      description: 'Experience a user-friendly interface for effortless web content collection.',
    },
    {
      keyword: 'AI Era Leadership',
      description: "Lead in the AI era with MuseDAM's AI artwork and asset management solutions.",
    },
  ],
}

export default function InspirationCollectionPage() {
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
    title: 'MuseDAM Inspiration Collection - One-Click Material Collection, Cloud Management',
    description:
      "MuseDAM's Inspiration Collection tool allows for the effortless batch collection of images, videos, and other materials from any website through a browser plugin, directly storing them in the cloud, enhancing the efficiency and convenience of creative work.",
  }
}
