import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function MultipleViewingFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.FileCollection,
        FeaturesEnum.SmartFolders,
        FeaturesEnum.Formats,
        FeaturesEnum.Sharing,
      ]}
    />
  )
}
