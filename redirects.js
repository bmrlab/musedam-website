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

  const redirectToApp = {
    source: '/:path(home|detail|share|login|profile)/:rest*',
    destination: 'https://musedam.cc/:path/:rest*',
    permanent: true,
  }

  const restRedirects = [
    {
      source: '/pricing',
      destination: 'https://app.museai.cc/pricing',
      permanent: true,
    },
    {
      source: '/account/orders/:rest*',
      destination: 'https://app.museai.cc/team/billing/orders/:rest*',
      permanent: true,
    },
  ]

  const redirects = [internetExplorerRedirect, redirectToApp, ...restRedirects]

  return redirects
}

export default redirects
