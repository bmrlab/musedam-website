const getDeployRegion = () => {
  if (typeof window === 'undefined') {
    return (process.env.DEPLOY_REGION || '').toLowerCase()
  }

  return (
    document?.documentElement?.dataset?.deployRegion ||
    process.env.NEXT_PUBLIC_DEPLOY_REGION ||
    ''
  ).toLowerCase()
}

export const getLocalePath = (language: string) => {
  // 繁体中文
  // if (getDeployRegion() === 'global' && language === 'zh-CN') {
  //   return 'zh-TW'
  // }
  return language
}
