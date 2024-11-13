'use client'

import Hero from '@/app/[lng]/features/_components/Hero'
import Showcase, { ShowcaseProps } from '@/app/[lng]/features/_components/Showcase'
import { motion } from 'framer-motion'
import { RelativeContainer } from '@/components/StyleWrapper/container'
import { MotionImage, MotionShadowImage } from '@/components/StyleWrapper/image'
import useAnimationTrace from '@/hooks/useAnimationTrace'

const heroData = {
  tag: 'Auto Tags',
  title: 'Intelligent Tagging: Simplify and Personalize',
  description:
    "MuseDAM's Auto Tags use AI to automatically categorize your assets with smart tags that understand your content. Say goodbye to manual tagging and discover the power of customized, efficient searches that enhance your brand's workflow.",
}

const showcaseData: ShowcaseProps = {
  title: 'Efficient Asset Management: Simplified',
  description:
    'Break free from traditional folder hierarchies. Discover your content in a single, streamlined step.',
  points: [
    {
      keyword: 'Content Recognition',
      description:
        'Our AI swiftly identifies and labels your images, making them searchable with ease.',
    },
    {
      keyword: 'Clustering',
      description: 'Automatically gather similar assets into well-organized collections.',
    },
    {
      keyword: 'Searchability',
      description: 'Find assets instantly, saving time and increasing productivity.',
    },
    {
      keyword: 'Customization',
      description: 'Tailor tags to your workflow by editing AI suggestions or adding your own.',
    },
    {
      keyword: 'Integration',
      description:
        'Seamlessly blend intelligent tagging into your processes for a more efficient asset management system.',
    },
  ],
}

export default function AutoTagsPage() {
  const { handleAnimationComplete, isBuildFinished } = useAnimationTrace({ initialStep: -1 })

  return (
    <div>
      <Hero {...heroData} />
      <Showcase {...showcaseData}>
        <motion.div
          className="grid justify-items-start w-[640px] pl-[60px]"
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.5 }}
          onAnimationComplete={() => handleAnimationComplete(0)}
        >
          <RelativeContainer>
            <MotionImage
              src="/Features/Auto-Tags/Auto-Tags-Images.png"
              width={456.8}
              height={471.61}
              alt="Auto-Tags-Images"
              initial={{ y: '10%', opacity: 0 }}
              animate={isBuildFinished(0) ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(1)}
            />
            <MotionShadowImage
              src="/Features/Auto-Tags/Auto-Tags-Example.png"
              width={136.45}
              height={97.3}
              alt="Auto-Tags-Example"
              className="absolute bottom-[39.51px] right-[-81.2px]"
              initial={{ x: '-10%', opacity: 0 }}
              animate={isBuildFinished(2) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
            <MotionImage
              src="/Features/Auto-Tags/Auto-Tags-Group.png"
              width={200}
              height={238}
              alt="Auto-Tags-Group"
              className="absolute top-[59px] right-[-95.65px]"
              initial={{ x: '10%', opacity: 0 }}
              animate={isBuildFinished(1) ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={() => handleAnimationComplete(2)}
            />
          </RelativeContainer>
        </motion.div>
      </Showcase>
    </div>
  )
}
