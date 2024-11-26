import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function MultipleViewingFeatures() {
  return (
    <MoreFeatures
      titleI18nKey="more-features.visual-workspace.title"
      features={[
        FeaturesEnum.FileCollection,
        FeaturesEnum.SmartFolders,
        FeaturesEnum.Formats,
        FeaturesEnum.Sharing,
      ]}
    />
  )
}
