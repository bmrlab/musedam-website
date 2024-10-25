import Image from 'next/image'

type PointsProps = { keyword: string; description: string }

export type ShowcaseProps = {
  image: string
  title: string
  description?: string
  points: PointsProps[]
}

export default function Showcase({ image, title, description, points }: ShowcaseProps) {
  return (
    <div className="grid w-full grid-cols-2">
      <div
        style={{
          background: 'linear-gradient(180deg, #9DAFC7 0%, #C3CFE8 100%)',
        }}
        className="col-span-1 flex items-center justify-center"
      >
        <Image src={image} width={640} height={640} alt="AI-Search-Hero"></Image>
      </div>
      <div className="col-span-1 p-20">
        <h2 className="font-baskervville text-[48px] font-normal leading-[54.91px] tracking-[1px]">
          {title}
        </h2>
        <p className="mt-6 font-mono text-[16px] font-light leading-6 tracking-[2%]">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-6">
          {points.map((point, index) => (
            <Point key={`${point}-${index}`} {...point} />
          ))}
        </div>
      </div>
    </div>
  )
}

const Point = ({ keyword, description }: PointsProps) => {
  return (
    <ul>
      <li className="list-disc">{keyword}</li>
      <p className="mt-2 font-mono text-[16px] font-light leading-6 tracking-[2%]">{description}</p>
    </ul>
  )
}
