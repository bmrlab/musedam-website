import React from 'react'
import { LocaleLink } from '@/components/LocalLink'
import type { HelpDocument as PayloadHelpDocument, HelpCategory as PayloadHelpCategory } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Icons from '@/components/icon'
interface HelpCategoryWithDocs extends PayloadHelpCategory {
    documents: PayloadHelpDocument[]
}

interface HelpCenterCategoriesProps {
    categories: HelpCategoryWithDocs[]
}

export const DocumentList = ({ documents, noTitle }: { documents: PayloadHelpDocument[], noTitle?: boolean }) => {
    return <div className="text-base text-[#242424]">
        {documents.map((document, index) => (
            <LocaleLink
                key={document.id}
                href={`/help/article/${document.slug}`}
                className={cn("group flex items-center justify-between py-6 ",
                    'transition-all duration-300 ease-in-out hover:text-gray-700',
                    (noTitle && index === 0) ? '' : 'border-t border-[rgba(0,0,0,0.1)] '
                )}
            >
                <span >
                    {document.title}
                </span>

                <div className="transition-transform group-hover:translate-x-1">
                    <Icons.arrowRightLong width={24} height={24} />
                </div>
            </LocaleLink>
        ))}
    </div>
}

export const HelpCenterCategories: React.FC<HelpCenterCategoriesProps> = ({ categories }) => {
    return (
        <div className="font-euclid mb-10 space-y-[30px]">
            {categories.map((category) => (
                <div key={category.id} className="rounded-[20px] border-2 border-[rgba(0,0,0,0.1)] px-[30px] pt-6 text-[#242424] shadow-none">
                    <div className="pb-6">
                        <div className="text-2xl font-medium ">
                            {category.title}
                        </div>
                        {category.description && (
                            <p className="text-gray-600">{category.description}</p>
                        )}
                    </div>
                    <DocumentList documents={category.documents} />
                </div>
            ))}
        </div>
    )
} 