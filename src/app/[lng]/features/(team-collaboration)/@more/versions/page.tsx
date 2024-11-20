import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function VersionsFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.Team,
        FeaturesEnum.Permissions,
        FeaturesEnum.Feedback,
        FeaturesEnum.DataStatistics,
      ]}
    />
  )
}