'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'

const heroData = {
  tag: 'Encrypted Sharing',
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
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #6A85B6 0%, #F5EFEF 100%)',
          }}
        >
          <motion.div
            className="grid w-[640px] h-[438px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <RelativeContainer>
              <MotionImage
                src="/Features/Encrypted-Sharing/Encrypted-Sharing-List.png"
                width={630}
                height={282.08}
                alt="Encrypted-Sharing-List"
                initial={{ y: '10%', opacity: 0 }}
                animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(1)}
              />
              <MotionImage
                src="/Features/Encrypted-Sharing/Encrypted-Sharing-Modal.png"
                width={336.5}
                height={313.67}
                alt="Encrypted-Sharing-Modal"
                className="rounded-[11.91px] absolute top-[124.5px] right-[64.5px] shadow-[0px_4px_30px_4px_#00000014]"
                initial={{ y: '-10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              />
            </RelativeContainer>
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}
