import { useLanguage } from "@/providers/Language"
import { useCallback, useMemo } from "react"

export default function usePublicUrl(basePath: string) {
    const { language } = useLanguage()
    const realBasePath = useMemo(() => language === 'zh' ? `${basePath}/ZH` : basePath, [basePath, language])

    const getUrl = useCallback((path: string) => {
        return `${realBasePath}/${path}`
    }, [realBasePath])

    return { getUrl, realBasePath }
}
