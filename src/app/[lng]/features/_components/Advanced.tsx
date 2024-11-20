export default function AdvancedBlock() {
  const features = [
    {
      title: 'Tags',
      description: 'Tailored tags streamline workflows',
    },
    {
      title: 'Metadata',
      description: 'Comprehensive metadata for clarity',
    },
    {
      title: 'Versions',
      description: 'Organized versioning for easy updates',
    },
    {
      title: 'Filters',
      description: 'Advanced filters for precise asset retrieval',
    },
  ]

  return (
    <div className="w-full py-[80px]">
      <h2 className="mb-[80px] text-center text-4xl">More than Just the Basics</h2>
      <div className="border-y border-l border-[#141414]">
        <div className="grid h-[320px] grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex size-full flex-col items-start justify-center border-r border-[#141414] p-6 px-10"
            >
              <h3 className="mb-6 text-[24px] font-normal leading-6 text-[#141414]">
                {feature.title}
              </h3>
              <p className="text-[16px] font-normal leading-[22px] text-[#3E3E59]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
