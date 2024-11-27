import { HTMLAttributes, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { AnimatePresence, motion } from 'framer-motion'

import useIsMobile from '@/hooks/useIsMobile'
import { Button } from '@/components/ui/button'
import AnimatedMenuButton from '@/components/Header/AnimatedMenuButton'
import useHeaderData, { FeatureItem } from '@/components/Header/data'
import { useMenuAnimation } from '@/components/Header/useMenuAnimation'
import { FlexCenterContainer } from '@/components/StyleWrapper/Container'
import { useHeaderTranslation } from '@/app/i18n/client'

export default function HeaderMobile({ className }: HTMLAttributes<HTMLDivElement>) {
  const { t } = useHeaderTranslation()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const scope = useMenuAnimation(isOpen)

  const { data: features } = useHeaderData()

  const categories = useMemo(() => features.map((f) => f.category), [features])

  const featuresRowFlat = useMemo(() => {
    const rowFlatItems: FeatureItem[] = []
    new Array(Math.max(...features.map((f) => f.items.length))).fill(0).forEach((_, i) => {
      new Array(features.length).fill(0).forEach((_, j) => {
        const data = features[j].items[i]
        rowFlatItems.push(data)
      })
    })
    return rowFlatItems
  }, [features])
  return (
    <FlexCenterContainer className={cn('hidden h-full w-screen justify-start md:flex', className)}>
      <div className="z-[51] shrink-0 px-4">
        <Link href="/">
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'dark' : 'light'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative size-9"
            >
              <Image src={isOpen ? '/logo-dark.svg' : '/logo.svg'} fill alt="muse logo" />
            </motion.div>
          </AnimatePresence>
        </Link>
      </div>
      <div ref={scope} className="flex size-full flex-1 justify-end">
        <MobileMenu />
        <motion.div
          layout
          className="z-50 h-full bg-black text-[16px] font-normal leading-[22px] text-white transition duration-300"
          initial={{ width: '140px' }}
          animate={{ width: isMobile ? '56px' : '140px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FlexCenterContainer className="size-full">
            <AnimatedMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </FlexCenterContainer>
        </motion.div>
      </div>
    </FlexCenterContainer>
  )
}

function MobileMenu() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        background: 'black',
        transform: 'translateY(-100%)',
        willChange: 'transform',
      }}
      className="flex flex-col justify-between px-[30px] pb-5 pt-[76px] text-white"
    >
      <ul>
        <li>Portfolio</li>
        <li>About</li>
        <li>Contact</li>
        <li>Search</li>
      </ul>
      <div className="h-[95px] px-[30px] py-5">
        <button className="size-full rounded-[8px] bg-white font-mono text-[16px] font-normal leading-[22px] text-[#141414]">
          Login
        </button>
      </div>
    </nav>
  )
}
