import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/controller'

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Pagination, Mousewheel, Controller } from 'swiper/modules'
import { useState } from 'react'

export default function SwiperBlock() {
  const [firstSwiper, setFirstSwiper] = useState<SwiperClass>(null)
  const [secondSwiper, setSecondSwiper] = useState<SwiperClass>(null)

  return (
    <div className="grid grid-cols-3 h-[765px] w-full">
      <Swiper
        onSwiper={setSecondSwiper}
        controller={{ control: firstSwiper }}
        direction={'vertical'}
        effect={'fade'}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        mousewheel={{
          enabled: true,
          releaseOnEdges: true,
        }}
        modules={[Mousewheel, Pagination, Controller]}
        className="h-[480px] col-span-1 w-full"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
      <div
        style={{
          background: 'linear-gradient(157.66deg, #D4D6EA 14.56%, #DBCCD5 31.62%, #FB9D70 94.18%)',
        }}
        className="col-span-2 w-full flex justify-center items-center"
      >
        <Swiper
          onSwiper={setFirstSwiper}
          controller={{ control: secondSwiper }}
          direction={'vertical'}
          effect={'fade'}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          mousewheel={{
            enabled: true,
            releaseOnEdges: true,
          }}
          onSlideChange={swiper => {
            setTimeout(function () {
              swiper.params.mousewheel.releaseOnEdges = false
            }, 200)
          }}
          onReachBeginning={swiper => {
            setTimeout(function () {
              swiper.params.mousewheel.releaseOnEdges = true
            }, 500)
          }}
          onReachEnd={swiper => {
            setTimeout(function () {
              swiper.params.mousewheel.releaseOnEdges = true
            }, 500)
          }}
          modules={[Mousewheel, Pagination, Controller]}
          className="bg-red-400 w-[640px] h-[480px]"
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}
