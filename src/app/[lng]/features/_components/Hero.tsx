import { Button } from '@/components/ui/button'
import { ArrowDownRight } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { Badge } from '@/components/ui/badge'

export default function Hero({
  tag,
  title,
  description,
  tagColor,
}: {
  tag: string
  title: string
  description: string
  tagColor: string
}) {
  return (
    <div className="flex flex-col justify-center bg-white px-6 py-[60px] text-black md:h-[calc(100vh-70px)] md:px-20 md:py-0">
      <div className="mb-2">
        <Badge
          style={{
            background: tagColor,
          }}
          className="cursor-default rounded-full font-mono text-[12px] font-normal leading-5 text-black"
        >
          {tag}
        </Badge>
      </div>
      <h1
        className={cn(
          'mb-[16px] font-baskervville text-[38px] font-normal leading-[43.47px] tracking-[1px] md:mb-6 md:text-[120px] md:leading-[132px]',
        )}
      >
        {title}
      </h1>
      <p className="mb-12 font-mono text-[14px] font-light leading-[28px] tracking-[2%] md:text-[24px] md:leading-[38.4px]">
        {description}
      </p>
      <div className="flex h-[58px] items-center justify-center md:justify-between">
        <Button className="h-full rounded-full bg-black px-[52.2px] py-[19px] font-mono text-[16px] font-normal leading-5 text-white transition-colors hover:bg-gray-800">
          Start for free
        </Button>
        <ArrowDownRight className="hidden size-8 text-black md:block" />
      </div>
    </div>
  )
}
