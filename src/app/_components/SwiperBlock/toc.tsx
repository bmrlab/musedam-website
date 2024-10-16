import { cn } from '@/app/lib/utils'
import { motion } from 'framer-motion'

export default function Toc({
  data,
  activeIndex,
  setActiveIndex,
  className,
}: {
  data: string[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  className?: string
}) {
  return (
    <div className={cn('pl-[18px]', className)}>
      <ul className="space-y-2 relative">
        <div className="absolute left-[-18px] top-0 w-0.5 h-full bg-[#00000014]"></div>
        {data.map((item, index) => (
          <motion.li
            key={item}
            className="cursor-pointer relative"
            onClick={() => setActiveIndex(index)}
            initial={false}
            animate={{
              color: index === activeIndex ? '#141414' : '#B8B8B8',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-normal text-[20px] leading-[22.88px] text-nowrap">{item}</span>
            {index === activeIndex && (
              <motion.div
                className="absolute left-[-18px] top-0 w-0.5 h-full bg-[#141414]"
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
