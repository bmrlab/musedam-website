import Image from 'next/image'
import React from 'react'
import LngSelector from '@/[lng]/components/Footer/LngSelector'

export default function FooterMobile({ lng }: { lng: string }) {
  return (
    <footer className="flex h-[68px] w-screen items-center justify-between bg-white px-5">
      <Image src="/logo.svg" width={36} height={36} alt="muse logo" />
      <div className="w-[101px]">
        <LngSelector language={lng} />
      </div>
    </footer>
  )
}
