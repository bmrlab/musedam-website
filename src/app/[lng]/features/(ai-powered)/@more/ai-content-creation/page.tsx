import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function AiContentCreationFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.AISearch,
        FeaturesEnum.AIParsing,
        FeaturesEnum.AutoTags,
        FeaturesEnum.MuseCopilot,
      ]}
    />
  )
}
