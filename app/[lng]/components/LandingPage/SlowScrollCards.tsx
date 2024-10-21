import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import useScreenWidth from '@/hooks/useScreenWidth'

const SlowScrollCards = () => {
  const screenWidth = useScreenWidth()

  const containerVariants = {
    animate: {
      x: [0, -screenWidth],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 50,
          ease: 'linear',
        },
      },
    },
  }

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{
          display: 'flex',
          width: 'fit-content',
        }}
        variants={containerVariants}
        animate="animate"
        className="gap-6"
      >
        {new Array(10).fill(0).map((_, index) => (
          <Card
            key={index}
            avatar="/avatar.png"
            name="Sophia Lee"
            role="Creative Director"
            description="Muse has become our go-to for file storage, replacing Google Drive entirely.
It’s not just affordable; it’s a game-changer for organizing assets across teams. The search capabilities are unmatched."
          />
        ))}
      </motion.div>
    </div>
  )
}

const Card = ({ name, role, description, avatar }) => {
  return (
    <div className="flex w-[360px] flex-col gap-6 rounded-[8px] bg-white p-[30px] shadow-[0_4px_30px_4px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-4">
        <Image src={avatar} width={64} height={64} alt={name} className="rounded-full" />
        <div className="grid items-center justify-start gap-1.5">
          <h4 className="text-[24px] font-normal leading-[28px]">{name}</h4>
          <span className="text-[13px] font-light leading-[16.9px] text-[#898989]">{role}</span>
        </div>
      </div>
      <p className="w-full text-[14px] font-light leading-[28px] text-[#141414]">{description}</p>
    </div>
  )
}

export default SlowScrollCards
