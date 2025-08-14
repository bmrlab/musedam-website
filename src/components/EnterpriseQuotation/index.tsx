'use client'
import { LeftContent } from './LeftContent'
import { RightContent } from './RightContent'
import { useEffect } from 'react'
import { QuotationPreviewContent } from './Preview/index'
import { SessionUser } from '@/types/user'
import { useQuotationStore } from '@/providers/QuotationStore'

export default function EnterpriseQuotation({ id, user }: { id?: string, user: SessionUser | null }) {
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

    const {
        initializeUserEmail,
        setAdvancedConfig
    } = useQuotationStore()

    // 初始化用户邮箱
    useEffect(() => {
        initializeUserEmail(user ?? null)
    }, [user, initializeUserEmail])

    // 根据部署区域设置Advanced配置
    useEffect(() => {
        if (!isGlobal) {
            setAdvancedConfig({ memberSeats: 15, storageSpace: 3, aiPoints: 0 })
        }
    }, [isGlobal, setAdvancedConfig])

    return (
        <>
            {!!id
                ? <QuotationPreviewContent id={id} user={user} />
                : (user ?
                    <div className="flex size-full">
                        <div className='h-screen flex-1'>
                            <LeftContent user={user} />
                        </div>
                        <div className='h-screen flex-1'>
                            <RightContent />
                        </div>
                    </div>
                    : <></>
                )
            }
        </>
    )
}
