import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function AiSearchPageFeatures() {
  return (
    <MoreFeatures
      titleI18nKey="more-features.ai-powered.title"
      features={[
        FeaturesEnum.AIParsing,
        FeaturesEnum.ContentCreation,
        FeaturesEnum.AutoTags,
        FeaturesEnum.MuseCopilot,
      ]}
    />
  )
}
