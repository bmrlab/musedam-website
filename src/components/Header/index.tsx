'use client'

import HeaderDesktop from '@/components/Header/desktop'
import HeaderMobile from '@/components/Header/mobile'
import { cn } from '@/utilities/cn';

export default function Header({ hideMenu }: { hideMenu?: boolean }) {
  // const [isScrolling, setIsScrolling] = useState(false);
  // const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolling(true);
  //     // 清除之前的定时器
  //     if (scrollTimer.current) clearTimeout(scrollTimer.current);
  //     // 设置新的定时器，150ms 后如果没有新的滚动事件，则认为停止滚动
  //     scrollTimer.current = setTimeout(() => {
  //       setIsScrolling(false);
  //     }, 150);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     if (scrollTimer.current) clearTimeout(scrollTimer.current);
  //   };
  // }, []);

  return (
    <nav className={cn("fixed z-50 flex h-[56px] w-full items-center border-b border-[#EBECEE] bg-white/90 font-mono transition-all duration-300 ease-in-out md:h-[70px]",
    )}>
      <HeaderDesktop className="hidden md:flex" hideMenu={hideMenu} />
      <HeaderMobile className="flex md:hidden" />
    </nav>
  )
}
