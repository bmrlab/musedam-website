import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function AiPoweredFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.AISearch,
        FeaturesEnum.AIParsing,
        FeaturesEnum.ContentCreation,
        FeaturesEnum.AutoTags,
      ]}
    />
  )
}
