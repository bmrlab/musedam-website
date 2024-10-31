'use client'

import 'swiper/css/grid'
import 'swiper/css'
import 'swiper/css/autoplay'
import SlowScrollCards from '@/components/LandingPage/Precept/SlowScrollCards'

export type PreceptData = {
  avatar: string
  name: string
  role: string
  description: string[]
}

const AvatarPrefix = '/Testimonial'

const data: PreceptData[] = [
  {
    avatar: `${AvatarPrefix}/avatar1.png`,
    name: 'Isabella Gray',
    role: 'Creative Director',
    description: [
      'The switch to Muse has been seamless, and it’s now an integral part of our content creation process.',
      'The ability to tag and categorize assets has saved us countless hours.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar2.png`,
    name: 'Ava Martin',
    role: 'Brand Manager',
    description: [
      'I can’t recommend Muse highly enough.',
      'It’s made managing our digital assets a walk in the park, with features that are both innovative and practical.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar3.png`,
    name: 'Mark Davis',
    role: 'IT Specialist',
    description: [
      'I’ve sung the praises of Muse before, and it continues to redefine how we handle creative assets.',
      'It’s like upgrading from an outdated note-taking app to a powerful project management tool – a quantum leap forward.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar4.png`,
    name: 'Oscar Dickieson',
    role: 'Content Creator',
    description: [
      'Loving Muse! 💖 ',
      'The ability to preview over 70 file formats in the browser is a lifesaver, and the real-time collaboration features are simply outstanding.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar5.png`,
    name: 'Sophia Lee',
    role: 'Creative Director',
    description: [
      'Muse has become our go-to for file storage, replacing Google Drive entirely.',
      'It’s not just affordable; it’s a game-changer for organizing assets across teams. The search capabilities are unmatched.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar6.png`,
    name: 'Lily Thompson',
    role: 'Marketing Manager',
    description: [
      'Muse has been a revelation for our marketing team, making it effortless to share and manage our digital assets. ',
      'It’s a tool that’s both intuitive and powerful.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar7.png`,
    name: 'Lara Turner',
    role: 'Digital Strategist',
    description: [
      'Muse is the Swiss Army knife of digital asset management. It’s packed with features that make our work not only easier but also more enjoyable.',
      'The team can’t imagine going back to the old ways now.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar8.png`,
    name: 'Jake Chandler',
    role: 'Operations Manager',
    description: [
      'The efficiency Muse brings to our workflow is unmatched!',
      'With its smart tagging and search, finding the right asset is now a breeze.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar9.png`,
    name: 'Mia Tse',
    role: 'Team Coordinator',
    description: [
      'Muse has completely transformed our team’s approach to asset management.',
      'It’s intuitive, user-friendly, and has become the backbone of our creative process.',
    ],
  },
  {
    avatar: `${AvatarPrefix}/avatar10.png`,
    name: 'Oliver Anderson',
    role: 'Art Director',
    description: [
      'With Muse, we’ve found a digital asset manager that not only meets but exceeds our expectations.',
      'The user interface is clean, and the functionality is robust—perfect for our creative workflow.',
    ],
  },
]

export default function Precept() {
  return (
    <div className="flex w-full flex-col items-center bg-black py-[60px] md:py-[80px]">
      <div className="grid justify-items-center gap-6 font-mono text-white">
        <h1 className="font-baskervville text-[38px] font-normal leading-[43.47px] md:text-[48px] md:leading-[55px]">
          Trusted by the Best
        </h1>
        <span className="font-mono text-[14px] font-light leading-[24px] md:text-[16px]">
          Discover What Our Community Loves About Muse
        </span>
      </div>
      <div className="mt-[60px] w-screen">
        <SlowScrollCards data={data} />
      </div>
    </div>
  )
}
