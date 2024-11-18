'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'
import { tagColor } from '../const'

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

const ImageBasePath = '/Features/Dynamic-Feedback'

export default function DynamicFeedbackPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(153.22deg, #DBDBDA 4.46%, #FAF9E7 60%)',
          }}
        >
          <motion.div
            className="grid w-[640px] pl-1 pr-[31px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <MotionImage
              src={`${ImageBasePath}/Dynamic-Feedback1.png`}
              width={148}
              height={30}
              alt="Dynamic-Feedback1"
              className="justify-self-end mr-[13px]"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(1)}
            />
            <MotionImage
              src={`${ImageBasePath}/Dynamic-Feedback.png`}
              width={230}
              height={36}
              alt="Dynamic-Feedback"
              className="justify-self-end"
              initial={{ y: '10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
            />
            <RelativeContainer className="mt-5 w-fit">
              <MotionImage
                src={`${ImageBasePath}/Dynamic-Feedback-Image.png`}
                width={566.95}
                height={377.43}
                alt="Dynamic-Feedback-Image"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
              <MotionShadowImage
                src={`${ImageBasePath}/Dynamic-Feedback-Comment.png`}
                width={279.71}
                height={83.19}
                alt="Dynamic-Feedback-Comment"
                className="absolute bottom-[55.81px] right-[-27.71px]"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </RelativeContainer>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
      <FamousQuotes className="h-[800px]" />
      <MoreFeatures
        features={[
          FeaturesEnum.Team,
          FeaturesEnum.Permissions,
          FeaturesEnum.Versions,
          FeaturesEnum.DataStatistics,
        ]}
      />
    </div>
  )
}
