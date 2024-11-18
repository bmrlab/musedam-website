import { FeaturesCardProps } from './card'

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

export const FeaturesCards: {
  [key in FeaturesEnum]: FeaturesCardProps
} = {
  // AI Powered
  [FeaturesEnum.AISearch]: {
    title: 'AI Search',
    description: 'Visual Content Asset Search',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/AI-Search.svg`,
    bgColor: '#BCCAE0',
    iconBgColor: '#fff',
  },
  [FeaturesEnum.AIParsing]: {
    title: 'AI Parsing',
    description: 'Visuals, Color Schemes, Themes, etc.',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/AI-Parsing.svg`,
    bgColor: '#DEFF00',
    iconBgColor: '#333333',
  },
  [FeaturesEnum.ContentCreation]: {
    title: 'Content Creation',
    description: 'Craft Blog from Asset Insights',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Content-Creation.svg`,
    bgColor: '#DDD2F3',
    iconBgColor: '#fff',
  },
  [FeaturesEnum.AutoTags]: {
    title: 'Auto Tags',
    description: 'Auto-Tag for Search & Clustering',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Auto-Tags.svg`,
    bgColor: '#FFB5DB',
    iconBgColor: '#5F4754',
  },
  [FeaturesEnum.MuseCopilot]: {
    title: 'MuseCopilot',
    description: 'Chat with Copilot on your Content',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/MuseCopilot.svg`,
    bgColor: '#928DFF',
    iconBgColor: '#B2FFD8',
  },
  // Visual Workspace
  [FeaturesEnum.FileCollection]: {
    title: 'File Collection',
    description: 'Web browser Extension',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Inspiration-Collection.svg`,
    bgColor: '#8BE3D9',
    iconBgColor: '#FFEFE8',
  },
  [FeaturesEnum.SmartFolders]: {
    title: 'Smart Folders',
    description: 'Automatic Categorization',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Smart-Folders.svg`,
    bgColor: '#3910EC',
    iconBgColor: '#D3E5FF',
    darkness: true,
  },
  [FeaturesEnum.Formats]: {
    title: '70+ Formats',
    description: 'Online Preview for 70+ Formats',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/70+Formats.svg`,
    bgColor: '#FDF1EC',
    iconBgColor: '#6A4730',
  },
  [FeaturesEnum.MultipleViewing]: {
    title: 'Multiple Viewing',
    description: 'List, Kanban, Waterfall and Adaptive',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Multiple-Viewing.svg`,
    bgColor: '#B4D9FD',
    iconBgColor: 'linear-gradient(180deg, #F3FDA0 0%, #F3F1FB 100%)',
  },
  [FeaturesEnum.Sharing]: {
    title: 'Sharing',
    description: 'Set Expiry and Password for Sharing',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Encrypted-Sharing.svg`,
    bgColor: '#364665',
    iconBgColor: '#617396',
    darkness: true,
  },
  // Team Collaboration
  [FeaturesEnum.Team]: {
    title: 'Team',
    description: 'Member and Department Management',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Team-Management.svg`,
    bgColor: '#0F1275',
    iconBgColor: '#CBE5FF',
    darkness: true
  },
  [FeaturesEnum.Permissions]: {
    title: 'Permissions',
    description: 'Folder Permissions by Member Role',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Permissions.svg`,
    bgColor: '#FFA800',
    iconBgColor: '#FDFFCB',
  },
  [FeaturesEnum.Feedback]: {
    title: 'Feedback',
    description: 'Comments and Annotations',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Dynamic-Feedback.svg`,
    bgColor: '#E3E3DE',
    iconBgColor: '#E84614',
  },
  [FeaturesEnum.Versions]: {
    title: 'Versions',
    description: 'Version Control and History Access',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Versions.svg`,
    bgColor: '#FF8043',
    iconBgColor: '#292D29',
  },
  [FeaturesEnum.DataStatistics]: {
    title: 'Data Statistics',
    description: 'Activity Statistics and Leaderboards',
    iconUrl: `${FEATURES_ICON_BASE_PATH}/Data-Statistics.svg`,
    bgColor: '#5C45A7',
    iconBgColor: '#463B67',
    darkness: true
  },
}
