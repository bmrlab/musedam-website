import React from 'react'
import Image from 'next/image'

import LngSelector from '@/components/Footer/LngSelector'

export default function FooterMobile() {
  return (
    <footer className="flex h-[68px] w-screen items-center justify-between bg-white px-5 dark:bg-[#070707]">
      <Image src="/assets/logo.svg" width={36} height={36} alt="muse logo" />
      <div className="w-[101px]">
        <LngSelector />
      </div>
    </footer>
  )
}
