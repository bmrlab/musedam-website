"use client"
import Image from 'next/image'
import { FC, useEffect, useMemo, useState } from 'react'
import { addQuotationViewRecord, EShareAuth, getQuotationByUUid, getQuotationStatus, IQuotationInfo } from '@/endpoints/quotation'
import Loading from '../../LandingPage/loading'
import { useToast } from '@/hooks/use-toast'
import { Button } from '../../ui/button'
import { useCountry } from '@/providers/Country'
import { SessionUser } from '@/types/user'
import { QuotationPreviewContent } from './QuotationPreviewContent'
import { useTranslation } from '@/app/i18n/client'

export const QuotationSharePreview: FC<{ uuid: string, user: SessionUser | null, inShare?: boolean }> = (props) => {
    const { isInChina } = useCountry()
    const { t } = useTranslation('quotation')
    const [quoteNo, setQuoteNo] = useState('')
    const [password, setPassword] = useState('')
    const [isShare, setIsShare] = useState(false)
    const [info, setInfo] = useState<IQuotationInfo>()
    const { toast } = useToast()
    const [needPassword, setNeedPassword] = useState<boolean | undefined>(undefined)
    const [isClient, setIsClient] = useState(false)

    const isSelf = useMemo(() => Boolean(info && props.user && props.user?.userId === info.member?.userId), [info, props.user])

    const getInfoByUUid = () => {
        getQuotationByUUid(isInChina ? 'mainland' : 'global',
            { uuid: props.uuid, password, userId: props.user?.userId })
            .then((res) => {
                setInfo(res)
            }).catch((err) => {
                toast({
                    duration: 2000,
                    description: err.message ?? t('share.invalid.link')
                })
            })
    }

    // 密码验证处理
    const handlePasswordSubmit = () => {
        if (!password) {
            toast({
                description: t('share.enter.password'),
                duration: 2000,
            })
            return
        }
        getInfoByUUid()
    }

    // 确保只在客户端执行
    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isClient) return

        const addViewRecord = async () => {
            try {
                const { getBrowserDeviceInfo } = await import('@/utilities/getBrowserDeviceInfo')
                const { identifier, ...others } = getBrowserDeviceInfo()

                await addQuotationViewRecord(isInChina ? 'mainland' : 'global',
                    { deviceHash: identifier, uuid: props.uuid, device: JSON.stringify(others) })
            } catch (error) {
                console.warn('Failed to add view record:', error)
            }
        }

        addViewRecord()
    }, [isClient, props.uuid, isInChina])

    useEffect(() => {
        getQuotationStatus(isInChina ? 'mainland' : 'global',
            { uuid: props.uuid })
            .then((res) => {
                setQuoteNo(res.quotationNo)
                setNeedPassword(res.needPassword)
                setIsShare(res.isShare === 1)
                if (!res.needPassword) {
                    getInfoByUUid()
                }
            }).catch((err) => {
                toast({
                    duration: 2000,
                    description: err.message ?? t('share.invalid.id')
                })
            })
    }, [props.uuid])

    // 在客户端加载完成之前显示加载状态
    if (!isClient || needPassword === undefined) {
        return <Loading />
    }

    if (info) {
        return <QuotationPreviewContent
            info={info}
            showShare={isSelf}
            showEdit={isSelf}
            showDownload={isSelf || info?.shareAuth === EShareAuth.CAN_DOWNLOAD}
            user={props.user}
        />
    }

    // 如果是在分享模式且密码未验证，显示密码输入界面
    if (!isShare || needPassword) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black px-[30px] text-white">
                <div className="w-full text-center">
                    {/* Logo */}
                    <div className="mb-[20px] flex justify-center">
                        <Image src="/assets/logo.svg" alt="Muse Logo" width={100} height={100} className='mb-2 h-[72px] w-auto' />
                    </div>

                    {/* 标题和ID */}
                    <div className="mb-[60px]">
                        <div className="mb-[12px] text-[26px] font-semibold">{t('share.title')}</div>
                        <div className="text-xs  font-light text-white-72">{t('share.subtitle', { quoteNo })}</div>
                    </div>

                    {/* 密码输入框 */}
                    {!isShare ?
                        <div className="text-base">{t('share.not.shared')}</div>
                        : <>
                            <div className="mb-[20px]">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('share.password.placeholder')}
                                    className="h-11 w-[360px] max-w-full rounded-[8px] border border-white/20  bg-transparent px-4 text-base text-white placeholder:text-white/40 focus:outline-none md:text-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                                />
                            </div>

                            {/* 查看按钮 */}
                            <Button
                                onClick={handlePasswordSubmit}
                                className="h-11 w-[360px] max-w-full rounded-2xl bg-white text-base text-[#0E0E0E] hover:bg-gray-100"
                            >
                                {t('share.password.submit')}
                            </Button>
                        </>}
                </div>
            </div>
        )
    }

}
