import MoreFeatures from '@/app/[lng]/features/_components/MoreFeatures'
import { FeaturesEnum } from '@/app/[lng]/features/_components/MoreFeatures/features'

export default function FileFormatsFeatures() {
  return (
    <MoreFeatures
      titleI18nKey="more-features.visual-workspace.title"
      features={[
        FeaturesEnum.FileCollection,
        FeaturesEnum.SmartFolders,
        FeaturesEnum.MultipleViewing,
        FeaturesEnum.Sharing,
      ]}
    />
  )
}
