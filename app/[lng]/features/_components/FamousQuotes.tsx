import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function FamousQuotes({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center bg-black text-white',
        className,
      )}
    >
      <div className="mx-auto max-w-3xl text-center">
        <Avatar className="mx-auto mb-2.5 h-20 w-20">
          <AvatarImage src="/placeholder.svg" alt="Avatar" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <blockquote className="mb-6 text-[18px] font-light leading-[27px]">
          &ldquo;Muse has revolutionized our workflow. Our marketing and social media teams now
          access assets seamlessly, without interrupting our designers&apos; productivity. The speed
          and dependability of Muse surpass our previous experience with Dropbox, making it an
          indispensable tool for our creative process.&rdquo;
        </blockquote>
        <cite className="text-[16px] font-normal not-italic leading-4">
          <div>Name</div>
          <div className="mt-1">Co-Founder and CEO @ XXX</div>
        </cite>
      </div>
    </div>
  )
}
