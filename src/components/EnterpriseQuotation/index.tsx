'use client'
import { LeftContent } from './LeftContent'
import { RightContent } from './RightContent'
import { useEffect } from 'react'
import { SessionUser } from '@/types/user'
import { useQuotationStore } from '@/providers/QuotationStore'
import Image from 'next/image'
import Link from 'next/link'
import { DarkButton } from '../StyleWrapper/button'
import { useHeaderTranslation } from '@/app/i18n/client'
import { FlexCenterContainer } from '../StyleWrapper/Container'


export default function EnterpriseQuotation({ editId, user }: { editId?: string, user: SessionUser | null, inShare?: boolean }) {
    const {
        initializeUserEmail,
    } = useQuotationStore()
    const { t } = useHeaderTranslation()

    // 初始化用户邮箱
    useEffect(() => {
        initializeUserEmail(user ?? null)
    }, [user, initializeUserEmail])

    if (!user || !user.isSale) {
        return <div className="fixed top-0 z-[100] h-screen w-screen bg-black">
            <FlexCenterContainer className="flex size-full flex-col">
                <Image src="/assets/logo-dark.svg" width={100} height={100} alt="muse logo" />
                <div className="absolute bottom-[80px] flex w-[194px] flex-col items-center gap-4">
                    <span className='text-center text-lg font-medium text-white'>{t('not.sale.user')}</span>

                    <Link
                        href={!user ? '/auth' : '/pricing'}
                        prefetch={false}
                    >
                        <DarkButton className={'mr-5 h-[48px]'}>
                            <p className="hidden md:block">{user ? t('not.sale.user.button') : t('button.login')}</p>
                        </DarkButton>
                    </Link>
                </div>
            </FlexCenterContainer>
        </div>
    }
    return <div className="flex size-full">
        <div className='h-screen flex-1'>
            <LeftContent user={user} />
        </div>
        <div className='hidden h-screen flex-1 md:block'>
            <RightContent />
        </div>
    </div>
}
