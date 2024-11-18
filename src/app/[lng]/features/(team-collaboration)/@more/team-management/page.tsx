import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function TeamManagementFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.Permissions,
        FeaturesEnum.Feedback,
        FeaturesEnum.Versions,
        FeaturesEnum.DataStatistics,
      ]}
    />
  )
}
