import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { tagColor } from '../const'
import PageClient from './page.client'
import { Metadata } from 'next'

const heroData = {
  tag: 'Team Management',
  tagColor,
  title: 'Refine Your Workspace Control with Team Management',
  description:
    "Master workspace control with MuseDAM's team management tools, designed to amplify efficiency and cater to both team and department collaboration scenarios.",
}

const showcaseData: ShowcaseProps = {
  title: "Boost Team Productivity with MuseDAM's Team Management",
  points: [
    {
      keyword: 'Customize Your Brand Identity',
      description:
        'Share files and folders with customizable expirations: 30 days, 7 days, or permanent access.',
    },
    {
      keyword: 'Member Invitation Controls',
      description:
        'Actively manage team growth with member invitation controls, including easy invite management and customizable expiration dates.',
    },
    {
      keyword: 'Manage Team Hierarchy',
      description:
        "MuseDAM's intuitive department management tools lay the foundation for setting permissions for different folders in the workspace by department.",
    },
    {
      keyword: 'Bulk Operations for Scalability',
      description:
        'Save valuable time and resources by bulk importing member and department information.',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM Asset Management: Control, Optimize, and Secure Your Resources',
  points: [
    {
      keyword: 'Team Asset Library Control',
      description:
        "Effortlessly manage your team's asset library with MuseDAM, ensuring resources are well-organized and readily accessible.",
    },
    {
      keyword: 'Storage Space Management',
      description:
        'Optimize storage usage and costs by setting and managing storage space limits for team members with MuseDAM.',
    },
    {
      keyword: 'Asset Ownership Transfer',
      description:
        "Effortlessly manage resource consolidation and reorganization with MuseDAM's batch transfer of asset ownership.",
    },
    {
      keyword: 'Site-Wide File Sharing Toggle',
      description:
        "Align file sharing with your team's security and collaboration needs by enabling or disabling it across the platform with MuseDAM.",
    },
  ],
}

export default function TeamManagementPage() {
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
    title: 'MuseDAM | Team Management - Member and Department Control',
    description:
      'MuseDAM supports online preview of over 70 file formats, including images, design source files, 3D models, audio, and video, allowing users to visually and conveniently view and manage various digital assets.',
  }
}
