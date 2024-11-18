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
    <div className="flex h-[calc(100vh-70px)] flex-col justify-center bg-white px-20 text-black">
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
          'mb-6 font-baskervville text-[120px] font-normal leading-[132px] tracking-[1px]',
        )}
      >
        {title}
      </h1>
      <p className="mb-12 font-mono text-[24px] font-light leading-[38.4px] tracking-[2%]">
        {description}
      </p>
      <div className="flex h-[58px] items-center justify-between">
        <Button className="h-full rounded-full bg-black px-[52.2px] py-[19px] font-mono text-[16px] font-normal leading-5 text-white transition-colors hover:bg-gray-800">
          Start for free
        </Button>
        <ArrowDownRight className="h-8 w-8 text-black" />
      </div>
    </div>
  )
}
