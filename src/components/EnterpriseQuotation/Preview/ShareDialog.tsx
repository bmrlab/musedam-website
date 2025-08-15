"use client"
import { FC, useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { X, Copy, Check } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { IQuotationInfo, editQuotation } from '@/endpoints/quotation'
import { useCountry } from '@/providers/Country'
import { SessionUser } from '@/types/user'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface ShareDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    info: IQuotationInfo
    user: SessionUser | null
}

export const ShareDialog: FC<ShareDialogProps> = ({ open, onOpenChange, info, user }) => {
    const { t } = useTranslation('quotation')
    const { toast } = useToast()
    const { isInChina } = useCountry()
    const [publicAccess, setPublicAccess] = useState(info.isShare === 1)
    const [encryptedShare, setEncryptedShare] = useState(!!info.password)
    const [accessPassword, setAccessPassword] = useState(info.password || '')
    const [shareAuth, setShareAuth] = useState(info.shareAuth || 1)
    const [isUpdating, setIsUpdating] = useState(false)

    // 生成随机密码的工具函数
    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }

    // 初始值回填
    useEffect(() => {
        if (info) {
            setPublicAccess(info.isShare === 1)
            setEncryptedShare(!!info.password)
            setAccessPassword(info.password || '')
            setShareAuth(info.shareAuth || 1)
        }
    }, [info])

    // 处理公开访问状态变更
    const handlePublicAccessChange = async (newValue: boolean) => {
        if (!user?.orgId || !user?.token) {
            toast({
                description: t('share.dialog.user.invalid'),
                duration: 2000,
            })
            return
        }

        // 如果开启公开访问且加密分享也开启但没有密码，自动生成一个4位随机密码
        let newPassword = accessPassword
        if (newValue && encryptedShare && !accessPassword) {
            newPassword = generateRandomPassword()
            setAccessPassword(newPassword)
        }

        setIsUpdating(true)
        try {
            await editQuotation(isInChina ? 'mainland' : 'global', {
                userId: user.userId,
                orgId: user.orgId,
                token: user.token,
            }, {
                ...info,
                quotationId: info.id,
                isShare: newValue ? 1 : 0,
                // 如果关闭公开访问，清空密码
                password: newValue ? (encryptedShare ? newPassword : '') : '',
                shareAuth: shareAuth,
            })

            setPublicAccess(newValue)
            if (!newValue) {
                setEncryptedShare(false)
                setAccessPassword('')
                setShareAuth(1)
            }

            toast({
                description: newValue && encryptedShare && !accessPassword
                    ? t('share.dialog.auto.password.generated')
                    : t('share.dialog.update.success'),
                duration: 2000,
            })
        } catch (error) {
            // 如果更新失败，回滚密码状态
            if (newValue && encryptedShare && !accessPassword) {
                setAccessPassword('')
            }
            toast({
                description: t('share.dialog.update.failed'),
                duration: 2000,
            })
        } finally {
            setIsUpdating(false)
        }
    }

    // 处理加密分享状态变更
    const handleEncryptedShareChange = async (newValue: boolean) => {
        if (!user?.orgId || !user?.token) {
            toast({
                description: t('share.dialog.user.invalid'),
                duration: 2000,
            })
            return
        }

        // 如果开启加密分享且没有密码，自动生成一个4位随机密码
        let newPassword = accessPassword
        if (newValue && !accessPassword) {
            newPassword = generateRandomPassword()
            setAccessPassword(newPassword)
        }

        setIsUpdating(true)
        try {
            await editQuotation(isInChina ? 'mainland' : 'global', {
                userId: user.userId,
                orgId: user.orgId,
                token: user.token,
            }, {
                ...info,
                isShare: 1,
                quotationId: info.id,
                password: newValue ? newPassword : '',
                shareAuth: newValue ? shareAuth : undefined,
            })

            setEncryptedShare(newValue)
            if (!newValue) {
                setAccessPassword('')
                setShareAuth(1)
            }

            toast({
                description: newValue && !accessPassword
                    ? t('share.dialog.encrypted.enabled')
                    : t('share.dialog.update.success'),
                duration: 2000,
            })
        } catch (error) {
            // 如果更新失败，回滚密码状态
            if (newValue && !accessPassword) {
                setAccessPassword('')
            }
            toast({
                description: t('share.dialog.update.failed'),
                duration: 2000,
            })
        } finally {
            setIsUpdating(false)
        }
    }

    // 处理密码变更
    const handlePasswordChange = async (newPassword: string) => {
        if (!user?.orgId || !user?.token) {
            toast({
                description: t('share.dialog.insufficient.permissions'),
                duration: 2000,
            })
            return
        }

        // 验证密码长度
        if (newPassword.length < 4 || newPassword.length > 18) {
            toast({
                description: t('share.dialog.password.length.error'),
                duration: 2000,
            })
            return
        }

        setIsUpdating(true)
        try {
            await editQuotation(isInChina ? 'mainland' : 'global', {
                userId: user.userId,
                orgId: user.orgId,
                token: user.token,
            }, {
                ...info,
                isShare: 1,
                shareAuth: shareAuth,
                quotationId: info.id,
                password: newPassword,
            })

            setAccessPassword(newPassword)
            toast({
                description: t('share.dialog.update.success'),
                duration: 2000,
            })
        } catch (error) {
            toast({
                description: t('share.dialog.update.failed'),
                duration: 2000,
            })
        } finally {
            setIsUpdating(false)
        }
    }

    // 处理访问权限变更
    const handleShareAuthChange = async (newAuth: number) => {
        if (!user?.orgId || !user?.token) {
            toast({
                description: t('share.dialog.insufficient.permissions'),
                duration: 2000,
            })
            return
        }

        setIsUpdating(true)
        try {
            await editQuotation(isInChina ? 'mainland' : 'global', {
                userId: user.userId,
                orgId: user.orgId,
                token: user.token,
            }, {
                ...info,
                isShare: 1,
                quotationId: info.id,
                shareAuth: newAuth,
                password: accessPassword
            })

            setShareAuth(newAuth)
            toast({
                description: t('share.dialog.update.success'),
                duration: 2000,
            })
        } catch (error) {
            toast({
                description: t('share.dialog.update.failed'),
                duration: 2000,
            })
        } finally {
            setIsUpdating(false)
        }
    }

    // 生成分享链接和密码
    const shareLink = `${window.location.origin}/quotation/share/${info.uuid}`

    const handleCopy = async () => {
        try {
            const textToCopy = encryptedShare
                ? `${t('share.dialog.share.link')}：${shareLink}\n${t('share.dialog.access.password')}：${accessPassword}`
                : `${t('share.dialog.share.link')}：${shareLink}`

            await navigator.clipboard.writeText(textToCopy)
            toast({
                description: t('share.dialog.copy.success'),
                duration: 2000,
            })

        } catch (err) {
            toast({
                description: t('share.dialog.copy.failed'),
                duration: 2000,
            })
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal >
                <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-20 w-[448px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-[#262626] shadow-xl">
                    {/* 标题和关闭按钮 */}
                    <div className="mb-6 flex items-center justify-between gap-2">
                        <Dialog.Title className="text-lg font-semibold ">
                            {t('share.dialog.title')}
                        </Dialog.Title>
                        <Dialog.Close className="size-[22px] rounded-lg p-[4px] transition-all duration-300 ease-in-out hover:bg-gray-100">
                            <X className="size-[14px]" />
                        </Dialog.Close>
                    </div>

                    {/* 公开访问选项 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold ">
                                {t('share.dialog.public.access')}
                            </span>
                            <button
                                onClick={() => handlePublicAccessChange(!publicAccess)}
                                disabled={isUpdating}
                                className={cn(
                                    "relative inline-flex h-[22px] w-11 items-center rounded-full transition-colors",
                                    publicAccess ? "bg-blue-600" : "bg-gray-200",
                                    isUpdating && "cursor-not-allowed opacity-50"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block size-[18px] rounded-full bg-white transition-transform",
                                        publicAccess ? "translate-x-6" : "translate-x-[2px]"
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    {/* 分享链接字段 */}
                    {publicAccess && <><div className="mb-6">
                        <div className="rounded-lg border border-[#C5CEE0] p-3 text-[#141414]">
                            <input
                                type="text"
                                value={shareLink}
                                readOnly
                                className="w-full bg-transparent text-sm  outline-none "
                            />
                        </div>
                    </div>

                        {/* 访问权限选项 */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{t('share.dialog.access.permissions')}</span>
                                <Select
                                    value={shareAuth.toString()}
                                    onValueChange={(value) => handleShareAuthChange(Number(value))}
                                    disabled={isUpdating}
                                >
                                    <SelectTrigger className="h-[32px] w-[120px] justify-end  border-none shadow-none focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1" className="cursor-pointer rounded-[8px] transition-all duration-300 ease-in-out hover:bg-[#F8F8F8]">{t('share.dialog.view.only')}</SelectItem>
                                        <SelectItem value="2" className="cursor-pointer rounded-[8px] transition-all  duration-300 ease-in-out hover:bg-[#F8F8F8]">{t('share.dialog.can.download')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* 加密分享选项 */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{t('share.dialog.encrypted.share')}</span>
                                <button
                                    onClick={() => handleEncryptedShareChange(!encryptedShare)}
                                    disabled={isUpdating}
                                    className={cn(
                                        "relative inline-flex h-[22px] w-11 items-center rounded-full transition-colors",
                                        encryptedShare ? "bg-blue-600" : "bg-gray-200",
                                        isUpdating && "cursor-not-allowed opacity-50"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "inline-block size-[18px] rounded-full bg-white transition-transform",
                                            encryptedShare ? "translate-x-6" : "translate-x-[2px]"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* 访问密码字段 */}
                        {encryptedShare && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between">
                                    <div className='flex items-center gap-3'>
                                        <span className="text-sm ">{t('share.dialog.access.password')}</span>
                                        <span className="text-xs text-[#676C77]">{t('share.dialog.password.length')}</span>
                                    </div>
                                    <Input
                                        className="w-[80px] text-center font-euclid text-sm text-[#141414]"
                                        type="text"
                                        value={accessPassword}
                                        onChange={(e) => setAccessPassword(e.target.value)}
                                        onBlur={(e) => handlePasswordChange(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handlePasswordChange(e.currentTarget.value)
                                            }
                                        }}
                                        disabled={isUpdating}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 复制按钮 */}
                        <Button
                            onClick={handleCopy}
                            disabled={isUpdating}
                            className="h-[44px] w-full rounded-xl bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {encryptedShare ? t('share.dialog.copy.link.password') : t('share.dialog.copy.link')}
                        </Button>
                    </>
                    }
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
} 