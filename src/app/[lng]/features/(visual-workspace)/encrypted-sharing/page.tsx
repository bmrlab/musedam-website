import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { Metadata } from 'next'
import PageClient from './page.client'

const heroData = {
  tag: 'Encrypted Sharing',
  tagColor: '#E6F0FF',
  title: 'Secure and Flexible File Sharing',
  description:
    'Discover a feature-rich, encrypted file sharing solution that ensures unparalleled security and control for your sensitive data, setting MuseDAM apart from competitors like Dropbox and Google Drive.',
}

const showcaseData: ShowcaseProps = {
  title: 'Enhance Collaboration & Security with Encrypted Sharing',
  points: [
    {
      keyword: 'Flexible Sharing Options',
      description:
        'Share files and folders with customizable expirations: 30 days, 7 days, or permanent access.',
    },
    {
      keyword: 'Granular Access Controls',
      description:
        'Tailor access permissions for downloads, transfers, or view-only access with encrypted sharing for enhanced security.',
    },
    {
      keyword: 'Effortless Asset Management',
      description:
        'Batch transfer assets to MuseDAM with metadata retention, including titles, notes, tags, and more.',
    },
    {
      keyword: 'Password Protected Sharing',
      description:
        'Lock your shares with a password, ensuring only authorized users can access the content.',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'Share Link Management: Centralized Control & Visibility',
  points: [
    {
      keyword: 'Centralized Record Keeping',
      description:
        'Manage all sharing records from the Share Management section of the Management Dashboard for streamlined oversight.',
    },
    {
      keyword: 'Team Sharing Access',
      description:
        'Team members can access and review all team sharing records, enhancing collaboration and accountability.',
    },
    {
      keyword: 'Permission-Based Visibility and Control',
      description:
        'Customize share link access and management according to team member permissions, ensuring secure and efficient collaboration.',
    },
  ],
}

export default function EncryptedSharingPage() {
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
    title: 'MuseDAM | Sharing - Custom Expiry, Password Protection',
    description:
      "MuseDAM's sharing feature allows you to set expiration times and access passwords for materials, ensuring the security and privacy of shared content while providing a smooth collaboration experience.",
  }
}
