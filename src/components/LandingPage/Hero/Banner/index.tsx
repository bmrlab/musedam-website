import BannerDesktop from './Desktop'
import BannerMobile from './Mobile'

export default function Banner() {
  return (
    <div className="w-full">
      <BannerMobile className="md:hidden" />
      <BannerDesktop className="hidden lg:flex" />
    </div>
  )
}
