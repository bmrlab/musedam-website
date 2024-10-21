import Image from 'next/image'

export default function Hero() {
  return (
    <div className="flex w-full flex-col items-center justify-center px-[80px]">
      <h1 className="mt-[59px] text-center text-[68px] font-normal leading-[77.79px] text-[#141414]">
        <p>Smart Asset Management</p>
        <p>for the AI Content Era</p>
      </h1>
      <button className="mb-[58px] mt-9 rounded-[1000px] bg-black px-[57.5px] py-[19px] text-[16px] font-normal leading-[20px] text-white">
        Start for free
      </button>
      <Image src="/hero.png" width={1280} height={663} alt="muse hero" />
      <div className="mt-[80px] flex w-full items-center justify-between">
        <h1 className="text-[68px] font-normal leading-[77.79px] text-[#141414]">
          AI-Powered Asset Management
        </h1>
        <div className="flex max-w-[680px] flex-col items-start gap-10">
          <p className="text-[16px] font-light leading-6 text-[#141414]">
            Dive into the future of asset management with MuseDAM's cutting-edge AI system.
            Experience intelligent search, insightful smart parsing, and a robust suite of creative
            tools, all enhanced by our interactive MuseCopilot for a seamless experience.
          </p>
          <button className="rounded-[8px] bg-black px-[42.5px] py-[14px] text-[16px] leading-5 text-white">
            Start for free
          </button>
        </div>
      </div>
      <div className="mt-[80px] w-full px-10">
        <Image src="/video-replace.png" width={1200} height={692} alt="muse hero" className="object-contain" />
      </div>
    </div>
  )
}
