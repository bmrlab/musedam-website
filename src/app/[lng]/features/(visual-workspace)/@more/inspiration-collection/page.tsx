import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function InspirationCollectionFeatures() {
  return (
    <MoreFeatures
      features={[
        FeaturesEnum.FileCollection,
        FeaturesEnum.SmartFolders,
        FeaturesEnum.Formats,
        FeaturesEnum.MultipleViewing,
        FeaturesEnum.Sharing,
      ]}
    />
  )
}
