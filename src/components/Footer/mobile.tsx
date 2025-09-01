import React from 'react'
import Image from 'next/image'

import LngSelector from '@/components/Footer/LngSelector'

export default function FooterMobile({ isInChina }: { isInChina: boolean }) {
  return (
    <footer className="flex h-[68px] w-screen items-center justify-between bg-[#070707] px-5">
      <Image src="/assets/logo.svg" width={36} height={36} alt="muse logo" />
      {isInChina && <div className="w-[101px]">
        <LngSelector />
      </div>}
    </footer>
  )
}
