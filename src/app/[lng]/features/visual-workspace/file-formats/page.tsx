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

const heroData = {
  tag: '70+ File Formats',
  title: 'Experience Ultimate File Flexibility with 70+ Online Preview',
  description:
    'Step into the future of digital file management with MuseDAM, offering robust online preview and interaction capabilities for over 70 file formats. Simplify your workflow and enhance productivity with our comprehensive file support.',
}

const showcaseData: ShowcaseProps = {
  title: 'Supported File Formats Overview',
  points: [
    {
      keyword: 'Images',
      description: 'JPG, PNG, BMP, GIF, TIFF, WEBP, HEIF, PIC',
    },
    {
      keyword: 'Vector and Source Files',
      description: 'EPS, SVG, PSD, PSB, AI, SKETCH, XD, JSD, FIG, CDR',
    },
    {
      keyword: '3D Models',
      description: 'OBJ, PLY, 3DS, GLTF, GLB, FBX, STL',
    },
    {
      keyword: 'Audio Files',
      description: 'MP3, M4A, WAV',
    },
    {
      keyword: 'Videos',
      description: 'MOV, FLV, MP4, WEBM, QT, M4V, AVI, MKV, MGE, RMVB, BRM, MPG, TS',
    },
    {
      keyword: 'Spreadsheets',
      description: 'ET, XLS, XLT, XLSX, XLSM, XLTX, XLTM, CSV',
    },
    {
      keyword: 'Text Documents',
      description: 'TXT, DOC, DOCX, DOT, DOTX, DOCM, DOTM, WPS, WPT, RTF, HTML',
    },
    {
      keyword: 'Presentations',
      description: 'PDF, PPT, PPTX, PPTM, PPSM, PPSX, PPS, POTX, POTM, DPT, DPS',
    },
    {
      keyword: 'Fonts',
      description: 'TTF, OTF, TTC',
    },
  ],
}

const textDisplayData: TextDisplayProps = {
  title: 'MuseDAM: Superior File Compatibility for Digital Asset Management',
  description: "Elevate Your Digital Workflow with MuseDAM's Comprehensive File Support",
  points: [
    {
      keyword: 'Flexibility in File Handling',
      description: 'Embrace versatility in file handling with support for over 70 file types.',
    },
    {
      keyword: 'Efficiency Enhancement',
      description:
        'Boost efficiency with instant online previews, eliminating the need for extra software.',
    },
    {
      keyword: 'Accessibility Anytime, Anywhere',
      description:
        'Ensure accessibility to manage files from any location with an internet connection.',
    },
    {
      keyword: 'User-Friendly Operating Platform',
      description: 'Enjoy a user-friendly platform for a seamless file management experience.',
    },
  ],
}

export default function FileFormatsPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <FlexCenterContainer
          style={{
            height: '100%',
            background: 'linear-gradient(180deg, #FFF1EB 0%, #ACE0F9 100%)',
          }}
        >
          <motion.div
            className="grid justify-items-start w-[640px] gap-[13.41px]"
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
            onAnimationComplete={() => handleAnimationComplete(0)}
          >
            <MotionImage
              src="/Features/70+Formats/70+Formats1.png"
              width={465.43}
              height={59.65}
              alt="70+Formats1"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/70+Formats/70+Formats2.png"
              width={465.43}
              height={59.65}
              alt="70+Formats2"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/70+Formats/70+Formats3.png"
              width={465.43}
              height={59.65}
              alt="70+Formats3"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/70+Formats/70+Formats4.png"
              width={207.68}
              height={59.65}
              alt="70+Formats4"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/70+Formats/70+Formats5.png"
              width={529.86}
              height={59.65}
              alt="70+Formats5"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/70+Formats/70+Formats6.png"
              width={594.3}
              height={59.65}
              alt="70+Formats6"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/70+Formats/70+Formats7.png"
              width={207.68}
              height={59.65}
              alt="70+Formats7"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.2, ease: 'easeInOut' }}
            />
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
