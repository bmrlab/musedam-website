import { motion } from 'framer-motion'

export type AnimatedMenuButtonProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function AnimatedMenuButton({ isOpen, setIsOpen }: AnimatedMenuButtonProps) {
  const lineVariants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: (index: number) => ({
      rotate: index === 1 ? 45 : -45,
      y: index === 1 ? 4 : -4,
      width: 22,
    }),
  }

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex size-[22px] flex-col items-center justify-center gap-1.5"
    >
      <motion.span
        custom={1}
        variants={lineVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="h-0.5 w-full  bg-white"
        style={{ transformOrigin: 'center' }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        custom={2}
        variants={lineVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="h-0.5 w-1/2 self-end bg-white"
        style={{ transformOrigin: 'center' }}
        transition={{ duration: 0.3 }}
      />
    </button>
  )
}
