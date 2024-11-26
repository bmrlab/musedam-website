import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function DynamicFeedbackFeatures() {
  return (
    <MoreFeatures
      titleI18nKey="more-features.team-collaboration.title"
      features={[
        FeaturesEnum.Team,
        FeaturesEnum.Permissions,
        FeaturesEnum.Versions,
        FeaturesEnum.DataStatistics,
      ]}
    />
  )
}
