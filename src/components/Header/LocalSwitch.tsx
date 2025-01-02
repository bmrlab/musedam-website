import { useLanguage } from "@/providers/Language"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export const LocaleSwitch: React.FC = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { language, setLanguage } = useLanguage()
    const searchParams = useSearchParams()
    const otherLocale = language === 'zh' ? 'en' : 'zh'

    const changeLocale = useCallback(() => {
        const currentParams = new URLSearchParams(searchParams)
        const queryString = currentParams.toString()
        const newPathname = pathname?.replace(/^\/(en|zh)/, '/' + otherLocale) || ''
        const newUrl = `${newPathname}${queryString ? `?${queryString}` : ''}`
        router.replace(newUrl)
        setLanguage(otherLocale)
    }, [otherLocale, pathname, router, setLanguage, searchParams])

    return (
        <>
            <button
                className="locale-switch group relative inline-block h-[22px] w-[30px]"
                type="button"
                onClick={changeLocale}
            >
                <div className={`locale-switch__en absolute left-0 top-0 group-hover:z-0`}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="0.5" width="16" height="17" rx="2" fill="white" />
                        <path d="M5.84 4.432V13H12.2V11.884H7.148V9.16H11.708V8.044H7.148V5.548H11.996V4.432H5.84Z" fill="black" />
                        <rect x="1" y="0.5" width="16" height="17" rx="2" stroke="black" />
                    </svg>
                </div>

                <div className={`locale-switch__zh absolute left-0 top-0 group-hover:z-[1]`}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="0.5" width="16" height="17" rx="2" fill="black" />
                        <path
                            d="M8.412 3.112V5.188H4.152V10.984H5.292V10.3H8.412V14.32H9.588V10.3H12.72V10.984H13.86V5.188H9.588V3.112H8.412ZM5.292 9.184V6.304H8.412V9.184H5.292ZM9.588 9.184V6.304H12.72V9.184H9.588Z"
                            fill="white"
                        />
                        <rect x="1" y="0.5" width="16" height="17" rx="2" stroke="white" />
                    </svg>
                </div>
            </button>
            <style jsx>{`
          .locale-switch .locale-switch__en {
            transform: translate3d(0, 0, 0);
            transition: transform 0.25s ease-in-out;
            z-index: 1;
          }
          .locale-switch .locale-switch__zh {
            transform: translate3d(12px, 4px, 0);
            transition: transform 0.25s ease-in-out;
            z-index: 0;
          }
          .locale-switch:hover .locale-switch__en {
            transform: translate3d(12px, 4px, 0);
            z-index: 0;
          }
          .locale-switch:hover .locale-switch__zh {
            transform: translate3d(0, 0, 0);
            z-index: 1;
          }
        `}</style>
        </>
    )
}
