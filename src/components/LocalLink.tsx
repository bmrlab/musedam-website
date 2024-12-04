// components/LocaleLink.tsx
import { useLanguage } from '@/providers/Language'
import Link from 'next/link'

interface LocaleLinkProps {
    href: string
    children: React.ReactNode
    className?: string
    [key: string]: any
}

export const LocaleLink: React.FC<LocaleLinkProps> = ({
    href,
    children,
    ...props
}) => {
    const { language: lng } = useLanguage()

    // 如果 href 已经包含语言前缀，则直接使用
    if (href.startsWith(`/${lng}/`) || !href.startsWith(`/`)) {
        return (
            <Link href={href} {...props}>
                {children}
            </Link>
        )
    }

    // 否则添加语言前缀
    const localizedHref = `/${lng}${href.startsWith('/') ? href : `/${href}`}`

    return (
        <Link href={localizedHref} {...props}>
            {children}
        </Link>
    )
}
