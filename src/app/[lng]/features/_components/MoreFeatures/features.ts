import { useHeaderTranslation } from '@/app/i18n/client'

export enum FeaturesEnum {
  // AI Powered
  AISearch,
  AIParsing,
  ContentCreation,
  AutoTags,
  MuseCopilot,
  // Visual Workspace
  FileCollection,
  SmartFolders,
  Formats,
  MultipleViewing,
  Sharing,
  // Team Collaboration
  Team,
  Permissions,
  Feedback,
  Versions,
  DataStatistics,
}

const FEATURES_ICON_BASE_PATH = '/Features/Features-Card-Icons'

export const useFeaturesCards = () => {
  const { t } = useHeaderTranslation()
  return {
    // AI Powered
    [FeaturesEnum.AISearch]: {
      title: t('ai-powered.ai-search.title'),
      description: t('ai-powered.ai-search.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/AI-Search.svg`,
      bgColor: '#BCCAE0',
      iconBgColor: '#fff',
    },
    [FeaturesEnum.AIParsing]: {
      title: t('ai-powered.ai-parsing.title'),
      description: t('ai-powered.ai-parsing.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/AI-Parsing.svg`,
      bgColor: '#DEFF00',
      iconBgColor: '#333333',
    },
    [FeaturesEnum.ContentCreation]: {
      title: t('ai-powered.ai-content-creation.title'),
      description: t('ai-powered.ai-content-creation.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Content-Creation.svg`,
      bgColor: '#DDD2F3',
      iconBgColor: '#fff',
    },
    [FeaturesEnum.AutoTags]: {
      title: t('ai-powered.auto-tags.title'),
      description: t('ai-powered.auto-tags.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Auto-Tags.svg`,
      bgColor: '#FFB5DB',
      iconBgColor: '#5F4754',
    },
    [FeaturesEnum.MuseCopilot]: {
      title: t('ai-powered.muse-copilot.title'),
      description: t('ai-powered.muse-copilot.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/MuseCopilot.svg`,
      bgColor: '#928DFF',
      iconBgColor: '#B2FFD8',
    },
    // Visual Workspace
    [FeaturesEnum.FileCollection]: {
      title: t('visual-workspace.inspiration-collection.title'),
      description: t('visual-workspace.inspiration-collection.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Inspiration-Collection.svg`,
      bgColor: '#8BE3D9',
      iconBgColor: '#FFEFE8',
    },
    [FeaturesEnum.SmartFolders]: {
      title: t('visual-workspace.smart-folders.title'),
      description: t('visual-workspace.smart-folders.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Smart-Folders.svg`,
      bgColor: '#3910EC',
      iconBgColor: '#D3E5FF',
      darkness: true,
    },
    [FeaturesEnum.Formats]: {
      title: t('visual-workspace.file-formats.title'),
      description: t('visual-workspace.file-formats.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/70+Formats.svg`,
      bgColor: '#FDF1EC',
      iconBgColor: '#6A4730',
    },
    [FeaturesEnum.MultipleViewing]: {
      title: t('visual-workspace.multiple-viewing.title'),
      description: t('visual-workspace.multiple-viewing.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Multiple-Viewing.svg`,
      bgColor: '#B4D9FD',
      iconBgColor: 'linear-gradient(180deg, #F3FDA0 0%, #F3F1FB 100%)',
    },
    [FeaturesEnum.Sharing]: {
      title: t('visual-workspace.encrypted-sharing.title'),
      description: t('visual-workspace.encrypted-sharing.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Encrypted-Sharing.svg`,
      bgColor: '#364665',
      iconBgColor: '#617396',
      darkness: true,
    },
    // Team Collaboration
    [FeaturesEnum.Team]: {
      title: t('team-collaboration.team-management.title'),
      description: t('team-collaboration.team-management.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Team-Management.svg`,
      bgColor: '#0F1275',
      iconBgColor: '#CBE5FF',
      darkness: true
    },
    [FeaturesEnum.Permissions]: {
      title: t('team-collaboration.permissions.title'),
      description: t('team-collaboration.permissions.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Permissions.svg`,
      bgColor: '#FFA800',
      iconBgColor: '#FDFFCB',
    },
    [FeaturesEnum.Feedback]: {
      title: t('team-collaboration.dynamic-feedback.title'),
      description: t('team-collaboration.dynamic-feedback.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Dynamic-Feedback.svg`,
      bgColor: '#E3E3DE',
      iconBgColor: '#E84614',
    },
    [FeaturesEnum.Versions]: {
      title: t('team-collaboration.versions.title'),
      description: t('team-collaboration.versions.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Versions.svg`,
      bgColor: '#FF8043',
      iconBgColor: '#292D29',
    },
    [FeaturesEnum.DataStatistics]: {
      title: t('team-collaboration.data-statistics.title'),
      description: t('team-collaboration.data-statistics.description'),
      iconUrl: `${FEATURES_ICON_BASE_PATH}/Data-Statistics.svg`,
      bgColor: '#5C45A7',
      iconBgColor: '#463B67',
      darkness: true
    },
  }
}
