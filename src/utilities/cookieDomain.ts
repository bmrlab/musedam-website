export function getDomain(hostname: string) {
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return hostname
  } else {
    const parts = hostname.split('.')
    if (parts.length <= 2) {
      return `.${hostname}`
    } else {
      const baseDomain = parts.slice(-2).join('.')
      return `.${baseDomain}`
    }
  }
}
