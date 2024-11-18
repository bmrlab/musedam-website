import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function PermissionsFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.Team,
        FeaturesEnum.Feedback,
        FeaturesEnum.Versions,
        FeaturesEnum.DataStatistics,
      ]}
    />
  )
}
