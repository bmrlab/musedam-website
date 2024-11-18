'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { tagColor } from '../const'

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

const ImageBasePath = '/Features/Team-Management'

export default function TeamManagementPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #9795F0 0%, #FBC8D4 100%)',
          }}
        >
          <motion.div
            className="grid justify-center w-[640px] gap-[15px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <MotionImage
              src={`${ImageBasePath}/Team-Management1.png`}
              width={550}
              height={206}
              alt="Team-Management1"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(1)}
            />
            <MotionImage
              src={`${ImageBasePath}/Team-Management2.png`}
              width={550}
              height={312.9}
              alt="Team-Management2"
              initial={{ x: '10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
      <FamousQuotes className="h-[800px]" />
      <MoreFeatures
        features={[
          FeaturesEnum.Permissions,
          FeaturesEnum.Feedback,
          FeaturesEnum.Versions,
          FeaturesEnum.DataStatistics,
        ]}
      />
    </div>
  )
}
