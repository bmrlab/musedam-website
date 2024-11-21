import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function SmartFoldersFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.FileCollection,
        FeaturesEnum.Formats,
        FeaturesEnum.MultipleViewing,
        FeaturesEnum.Sharing,
      ]}
    />
  )
}
