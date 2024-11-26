import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function AiContentCreationFeatures() {
  return (
    <MoreFeatures
      titleI18nKey="more-features.ai-powered.title"
      features={[
        FeaturesEnum.AISearch,
        FeaturesEnum.AIParsing,
        FeaturesEnum.AutoTags,
        FeaturesEnum.MuseCopilot,
      ]}
    />
  )
}
