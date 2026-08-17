'use client'

import { useState } from 'react'

const DEMO_SRC =
  'https://assets-cdn.musedam.cc/public/testAssets/%E9%97%A8%E5%BA%97%E5%B7%A1%E6%A3%80%20Agent%20%E6%BC%94%E7%A4%BA.html'

export default function StoreInspectionDemo({ title }: { title: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-[calc(100dvh-56px)] w-full md:h-[calc(100dvh-70px)]">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0e0e10] text-sm text-white/60">
          Unpacking...
        </div>
      )}
      <iframe
        src={DEMO_SRC}
        title={title}
        className="h-full w-full border-0"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
