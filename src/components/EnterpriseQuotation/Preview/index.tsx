"use client"
import { twx } from '@/utilities/cn'
import { FC, useEffect, useMemo, useState } from 'react'
import { getQuotation, getQuotationForAdmin, IQuotationInfo } from '@/endpoints/quotation'
import Loading from '../../LandingPage/loading'
import { useToast } from '@/hooks/use-toast'
import { useCountry } from '@/providers/Country'
import { decodeNumber } from '@/utilities/numberCodec'
import { SessionUser } from '@/types/user'
import { QuotationPreviewContent } from './QuotationPreviewContent'
import { useTranslation } from '@/app/i18n/client'

export const QuotationPreview: FC<{ id: string, user: SessionUser | null, inShare?: boolean, password?: string, isAdmin?: boolean }> = (props) => {
    const { isInChina } = useCountry()
    const { t } = useTranslation('quotation')
    const [info, setInfo] = useState<IQuotationInfo>()
    const [wrong, setWrong] = useState<string>()
    const { toast } = useToast()
    const quotationId = decodeNumber(decodeURIComponent(props.id))
    const isSelf = useMemo(() => Boolean(!props.isAdmin && info && props.user && props.user?.userId === info.member?.userId), [info, props.user, props.isAdmin])


    useEffect(() => {
        if (!props.id || !props.user?.userId?.length) {
            setWrong(t('preview.invalid.user.quotation'))
            return
        }
        if (props.isAdmin) {
            if (!props.user?.orgId) {
                setWrong(t('preview.invalid.team.id'))
                return
            }
            getQuotationForAdmin(isInChina ? 'mainland' : 'global',
                { quotationId: quotationId, orgId: props.user?.orgId, userId: props.user?.userId })
                .then((res) => {
                    setInfo(res)
                }).catch((err) => {
                    setWrong(err.message ?? t('preview.get.quotation.failed'))
                })
        } else {
            if (!props.user.token || !props.user.orgId || !props.user.userId) {
                setWrong(t('preview.invalid.login.info'))
                return;
            }
            getQuotation(isInChina ? 'mainland' : 'global',
                {
                    quotationId: quotationId, userInfo: {
                        token: props.user.token,
                        orgId: props.user.orgId,
                        userId: props.user.userId
                    }
                })
                .then((res) => {
                    setInfo(res)
                }).catch((err) => {
                    setWrong(err.message ?? t('preview.get.quotation.failed'))
                })
        }
    }, [])


    useEffect(() => {
        if (wrong) {
            toast({
                duration: 100000,
                description: wrong,
            })
        }
    }, [toast, wrong])

    if (!info) {
        return <Loading />
    }

    return <QuotationPreviewContent
        info={info}
        showDownload={isSelf}
        showEdit={isSelf}
        showShare={isSelf}
        user={props.user}
    />
}
