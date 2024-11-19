import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import TextDisplay, { TextDisplayProps } from '@/app/[lng]/features/_components/TextDisplay'
import { Metadata } from 'next'
import PageClient from './page.client'

const heroData = {
  tag: '70+ File Formats',
  tagColor: '#E6F0FF',
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
    title: 'MuseDAM | Online Preview - 70+ Formats Supported, One-Click Viewing',
    description:
      'MuseDAM supports online preview of over 70 file formats, including images, design source files, 3D models, audio, and video, allowing users to visually and conveniently view and manage various digital assets.',
  }
}
