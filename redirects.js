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
    source: '/:path(home|detail|share|login|profile|pricing)/:rest*',
    destination: 'https://musedam.cc/:path/:rest*',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, redirectToApp]

  return redirects
}

export default redirects
