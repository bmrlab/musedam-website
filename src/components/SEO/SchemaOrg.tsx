import React from 'react'

interface SchemaOrgProps {
    type: 'organization' | 'website' | 'webpage' | 'article' | 'breadcrumb'
    data: any
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ type, data }) => {
    // 获取动态的 baseUrl
    const baseUrl = process.env.SITE_SERVER_URL || 'https://www.musedam.cc'

    const generateSchema = () => {
        switch (type) {
            case 'organization':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: data.name || 'MuseDAM',
                    description: data.description || 'AI驱动的企业数字资产管理系统',
                    url: data.url || baseUrl,
                    logo: data.logo || `${baseUrl}/assets/logo.svg`,
                    sameAs: [
                        'https://www.linkedin.com/company/musedam',
                        'https://twitter.com/musedam'
                    ],
                    contactPoint: {
                        '@type': 'ContactPoint',
                        contactType: 'customer service',
                        email: 'contact@musedam.cc'
                    },
                    address: {
                        '@type': 'PostalAddress',
                        addressCountry: 'CN',
                        addressLocality: 'Beijing'
                    }
                }

            case 'website':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: data.name || 'MuseDAM',
                    description: data.description || 'AI原生的企业数字资产管理平台',
                    url: data.url || baseUrl,
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate: `${baseUrl}/search?q={search_term_string}`
                        },
                        'query-input': 'required name=search_term_string'
                    }
                }

            case 'webpage':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: data.name || 'MuseDAM',
                    description: data.description || 'AI驱动的企业数字资产管理系统',
                    url: data.url || baseUrl,
                    isPartOf: {
                        '@type': 'WebSite',
                        name: 'MuseDAM'
                    }
                }

            case 'article':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: data.headline,
                    description: data.description,
                    image: data.image,
                    author: {
                        '@type': 'Organization',
                        name: 'MuseDAM'
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'MuseDAM',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${baseUrl}/assets/logo.svg`
                        }
                    },
                    datePublished: data.datePublished,
                    dateModified: data.dateModified || data.datePublished,
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': data.url
                    }
                }

            case 'breadcrumb':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: data.items.map((item: any, index: number) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: item.name,
                        item: item.url
                    }))
                }

            default:
                return {}
        }
    }

    const schema = generateSchema()

    if (Object.keys(schema).length === 0) {
        return null
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
            }}
        />
    )
}
