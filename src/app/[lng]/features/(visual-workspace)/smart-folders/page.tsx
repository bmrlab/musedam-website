'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import Image from 'next/image'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'

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
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #CFD9DF 0%, #E2EBF0 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-center w-[640px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <MotionImage
              src="/Features/Smart-Folders/Smart-Folders-Group.png"
              width={407}
              height={174.69}
              alt="Smart-Folders-Group"
              initial={{ y: '10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(1)}
            />
            <Image
              src="/Features/Smart-Folders/Smart-Folders-Folder.png"
              width={120.52}
              height={110.77}
              alt="Smart-Folders-Folder"
              className="mt-[10.31px]"
            />
            <MotionImage
              src="/Features/Smart-Folders/Smart-Folders-Settings.png"
              width={508.73}
              height={253.65}
              alt="Smart-Folders-Settings"
              className="mt-[34.23px]"
              initial={{ y: '-10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </FlexCenterContainer>
      </Showcase>
      <TextDisplay {...textDisplayData} />
    </div>
  )
}
