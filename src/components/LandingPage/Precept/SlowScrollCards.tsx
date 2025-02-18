import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { PreceptData } from '@/components/LandingPage/Precept/data'

const SlowScrollCards = ({ data }: { data: PreceptData[] }) => {
  const containerVariants = {
    animate: {
      x: [`0%`, `-50%`],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 100,
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
          willChange: 'transform',
        }}
        variants={containerVariants}
        animate="animate"
        className="gap-6"
      >
        {[...data, ...data].map(({ avatar, name, role, description }, index) => (
          <Card
            key={`scroll-${index}`}
            avatar={avatar}
            name={name}
            role={role}
            description={description}
          />
        ))}
      </motion.div>
    </div>
  )
}

const Card = ({ name, role, description, avatar }: PreceptData) => {
  return (
    <div className="flex h-fit w-[320px] flex-col gap-6 rounded-[8px] bg-white p-[30px] font-mono shadow-[0_4px_30px_4px_rgba(0,0,0,0.08)] md:w-[360px]">
      <div className="flex items-center gap-4">
        <Image src={avatar} width={64} height={64} alt={name} className="rounded-full" />
        <div className="grid items-center justify-start gap-1.5">
          <h4 className="text-[18px] font-extralight leading-[26px]">
            {name}
          </h4>
          <span className="text-[13px] font-light leading-[16.9px] text-[#898989]">{role}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start">
        {description.map((desc, index) => (
          <p key={index} className="w-full text-[14px] font-light leading-[28px] text-[#141414]">
            {desc}
          </p>
        ))}
      </div>
    </div>
  )
}

export default SlowScrollCards
