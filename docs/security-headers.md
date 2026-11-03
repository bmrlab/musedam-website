# Website security headers

The headers in `next.config.js` are emitted by Next.js and preserved by `withPayload`.
They take effect after rebuilding and redeploying the website image.

## Initial policy

- All routes receive `X-Content-Type-Options: nosniff` and
  `Referrer-Policy: strict-origin-when-cross-origin`.
- `/` and localized website pages (`/en-US`, `/zh-CN`, `/zh-TW`, including descendants)
  receive `X-Frame-Options: SAMEORIGIN`, device restrictions, and an enforcing CSP:
  `base-uri 'self'; object-src 'none'; frame-ancestors 'self'`.
- Same-origin Payload live preview remains allowed. Cross-origin embedding of website
  pages is blocked. The API, admin, and `/demo-app` proxies do not receive the website's
  framing or device restrictions.
- The Next.js/Payload `X-Powered-By` header is disabled.
- HSTS remains managed by the HTTPS ingress. Do not add another HSTS header here.

This initial CSP does not restrict script or resource sources and is not a complete
XSS mitigation. A later strict policy needs a resource inventory and report-only
validation, including Next.js hydration, analytics, Intercom, videos, and CMS previews.

## Release and verification

The existing `docker-build.yml` workflow builds on `v*` tags and updates **both** the
China and US production deployments. Its manual trigger currently uses the Git ref as
an image version; dispatching it against a branch does not provide a valid release tag.
Confirm the intended deployment scope before invoking this release workflow.

After rollout, inspect real GET responses, including redirects and an unknown page:

```sh
curl -sS -L -D - -o /dev/null https://musedam.ai
curl -sS -D - -o /dev/null https://www.musedam.ai/en-US
curl -sS -D - -o /dev/null https://www.musedam.ai/en-US/security-header-check-missing
```

Check that the final HTML response has all five new headers, the ingress HSTS header,
and no `X-Powered-By`. Check homepage navigation, pricing, book-demo submission,
analytics/chat loading, CMS live preview, and `/demo-app` access. Re-run Security Headers
after verifying the public response; the final grade must be measured after deployment.

Rollback by redeploying the previous website image, or reverting the header change and
building a new release. Do not run database migrations for this configuration-only change.
