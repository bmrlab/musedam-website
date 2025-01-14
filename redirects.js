const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // 目前在 ingress 里面直接配置了，这里 env 需要 build 阶段生效，比较麻烦
  // const redirectToApp = {
  //   source: '/:path(home|detail|share|login|profile|settings|auth)/:rest*',
  //   destination: `${process.env.MUSE_BASE_URL}/:path/:rest*`,
  //   permanent: true,
  // }

  const restRedirects = [
    // {
    //   source: '/pricing',
    //   destination: 'https://app.museai.cc/pricing',
    //   permanent: true,
    // },
    // {
    //   source: '/account/orders/:rest*',
    //   destination: 'https://app.museai.cc/team/billing/orders/:rest*',
    //   permanent: true,
    // },
  ]

  const redirects = [
    internetExplorerRedirect,
    // redirectToApp,
    ...restRedirects,
  ]

  return redirects
}

export default redirects
