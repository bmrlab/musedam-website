import Image from 'next/image'

export default function Hero() {
  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <h1 className="mt-[59px] text-center text-[68px] font-normal leading-[77.79px] text-[#141414]">
        <p>Smart Asset Management</p>
        <p>for the AI Content Era</p>
      </h1>
      <button className="mb-[58px] mt-9 rounded-[1000px] bg-black px-[57.5px] py-[19px] text-[16px] font-normal leading-[20px] text-white">
        Start for free
      </button>
      <Image src="/hero.png" width={1280} height={663} alt="muse hero" />
    </div>
  )
}
