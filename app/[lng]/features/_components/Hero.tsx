import { Button } from '@/components/ui/button'
import { ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Hero() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-20 text-black">
      <div className="">
        <div className="mb-8">
          <span className="inline-block rounded bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            AI Parsing
          </span>
        </div>
        <h1
          className={cn(
            'font-baskervville mb-6 text-[120px] font-normal leading-[132px] tracking-[1px]',
          )}
        >
          Deep Dive into Your Assets with AI Parsing
        </h1>
        <p className="mb-12 font-mono text-[24px] font-light leading-[38.4px] tracking-[2%]">
          MuseDAM's AI Parsing technology goes deep to unlock the full potential of your creative
          assets. It analyzes images beyond basic tags, uncovering detailed insights into content,
          colors, mood, and more. This intelligence empowers you to search and find the perfect
          asset for your project with remarkable speed and precision.
        </p>
        <div className="flex h-[58px] items-center justify-between">
          <Button className="h-full rounded-full bg-black px-[52.2px] py-[19px] font-mono text-[16px] font-normal leading-5 text-white transition-colors hover:bg-gray-800">
            Start for free
          </Button>
          <ArrowDownRight className="h-8 w-8 text-black" />
        </div>
      </div>
    </div>
  )
}
