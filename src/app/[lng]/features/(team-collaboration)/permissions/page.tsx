import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { tagColor } from '../const'
import PageClient from './page.client'
import { Metadata } from 'next'

const heroData = {
  tag: 'Permissions',
  tagColor: tagColor,
  title: 'Streamline Team Workflows with Precise Access Controls',
  description:
    "Control your team's digital workflow by customizing access to both shared and private workspaces with MuseDAM's Permissions feature, designed to streamline collaboration and maintain focus.",
}

const showcaseData: ShowcaseProps = {
  title: "Drive Team Performance through MuseDAM's Permissions",
  points: [
    {
      keyword: 'Workspace Flexibility',
      description:
        "Divide your team's digital space into shared and private areas to accommodate both collaborative and individual work.",
    },
    {
      keyword: 'Private Space Management',
      description:
        'Private space administrators have the autonomy to activate or deactivate these areas, providing a secure environment for sensitive projects.',
    },
    {
      keyword: 'Customizable Shared Space Permissions',
      description:
        "Customize folder access in your team's shared space to meet the specific needs of members and departments with granular permissions: Edit, Upload, View, and Download.",
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM Permissions: The Foundation of Team Efficiency and Security',
  points: [
    {
      keyword: 'Data Integrity and Access Control',
      description: 'Ensure data integrity and team access with precise permission settings.',
    },
    {
      keyword: 'Private Space Security',
      description: 'Safeguard sensitive data with flexible private space management.',
    },
    {
      keyword: 'Collaboration through Permissions',
      description: 'Nurture collaboration through controlled permissions that drive teamwork.',
    },
    {
      keyword: 'Productivity through Streamlined Access',
      description: 'Boost productivity by streamlining resource access for team members.',
    },
    {
      keyword: 'Unlock Team Potential',
      description:
        "Don't let inflexible permissions hinder your team's potential. With MuseDAM Permissions, create a tailored access control system that boosts efficiency and security.",
    },
  ],
}

export default function PermissionsPage() {
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
    title: 'MuseDAM | Permissions - Role-Based Access Control',
    description:
      'MuseDAM offers role-based folder permission management, allowing teams to assign granular access rights based on roles, ensuring the security and compliance of digital assets while promoting efficient collaboration within the team.',
  }
}
