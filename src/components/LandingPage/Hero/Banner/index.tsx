import BannerDesktop from './Desktop'
import BannerMobile from './Mobile'

export default function Banner({ isDark }: { isDark?: boolean }) {
  return (
    <div className="w-full">
      <BannerMobile className="md:hidden" isDark />
      <BannerDesktop className="hidden lg:flex" isDark />
    </div>
  )
}
