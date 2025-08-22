"use client"
import { HelpDocument } from "@/payload-types"
import { DocumentList } from "./HelpCenterCategories"
import { useHelpCenterTranslation } from "@/app/i18n/client"


export const RelatedArticles = ({ docs }: { docs: HelpDocument[] }) => {
    const { t } = useHelpCenterTranslation()

    return <div>
        <h2 className="mt-10 mb-6 font-euclid text-2xl font-medium text-[#242424]">{t('common.relatedArticles')}</h2>
        <div className='rounded-[20px] border-2 border-[rgba(0,0,0,0.1)] px-[30px] shadow-none'>
            <DocumentList documents={docs} noTitle />
        </div>
    </div>
}