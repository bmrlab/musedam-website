'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { FlexCenterContainer, RelativeContainer } from '@/components/StyleWrapper/container'
import useAnimationTrace from '@/hooks/useAnimationTrace'
import { motion } from 'framer-motion'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import Image from 'next/image'
import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'
import FamousQuotes from '@/app/[lng]/features/_components/FamousQuotes'

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
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #84FAB0 0%, #8FD3F4 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-center w-[640px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <div className="flex justify-between w-full px-[46px] h-[72px]">
              <motion.div
                className="grid grid-cols-2 gap-0"
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(1)}
              >
                <Image
                  src="/Features/Inspiration-Collection/Inspiration-Collection-Midjourney.png"
                  width={49.79}
                  height={49.79}
                  alt="Inspiration-Collection-Midjourney"
                />
                <Image
                  src="/Features/Inspiration-Collection/Inspiration-Collection-Discord.png"
                  width={55.82}
                  height={55.82}
                  alt="Inspiration-Collection-Discord"
                  className="self-end ml-[-13px]"
                />
              </motion.div>
              <MotionImage
                src="/Features/Inspiration-Collection/Inspiration-Collection-Browsers.png"
                width={180.74}
                height={62.63}
                alt="Inspiration-Collection-Browsers"
                className="h-fit self-end"
                onAnimationComplete={() => handleAnimationComplete(1)}
                initial={{ x: '-10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>
            <MotionImage
              src="/Features/Inspiration-Collection/Inspiration-Collection-URL.png"
              width={516.44}
              height={39}
              alt="Inspiration-Collection-URL"
              className="mt-[29px]"
              initial={{ y: '-10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <RelativeContainer className="mt-[20px]">
              <MotionShadowImage
                src="/Features/Inspiration-Collection/Inspiration-Collection-Images.png"
                width={465.03}
                height={459.7}
                alt="Inspiration-Collection-Images"
                initial={{ y: '10%', opacity: 0 }}
                animate={isBuildFinished(1) ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: 'easeInOut' }}
                onAnimationComplete={() => handleAnimationComplete(4)}
              />
              <MotionImage
                src="/Features/Inspiration-Collection/Inspiration-Collection-Drag.png"
                width={192.54}
                height={192.54}
                alt="Inspiration-Collection-Drag"
                className="absolute top-[144px] right-[-57.51px]"
                initial={{ x: '10%', opacity: 0 }}
                animate={isBuildFinished(4) ? { x: 0, opacity: 1 } : {}}
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
          FeaturesEnum.FileCollection,
          FeaturesEnum.SmartFolders,
          FeaturesEnum.Formats,
          FeaturesEnum.MultipleViewing,
          FeaturesEnum.Sharing,
        ]}
      />
    </div>
  )
}
