import { cn } from '@/utilities/cn'
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
    <div className={cn('pl-4', className)}>
      <ul className="relative space-y-2">
        <div className="absolute left-[-18px] top-0 h-full w-0.5 bg-[#00000014]"></div>
        {data.map((item, index) => (
          <li key={item} className="relative cursor-pointer" onClick={() => setActiveIndex(index)}>
            <span
              className={cn(
                'm-3 text-nowrap font-baskervville text-[20px] font-normal leading-[30px]',
                index !== activeIndex && 'opacity-30 hover:opacity-60',
              )}
            >
              {item}
            </span>
            {index === activeIndex && (
              <motion.div
                className="absolute left-[-18px] top-0 h-full w-0.5 bg-[#141414]"
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
