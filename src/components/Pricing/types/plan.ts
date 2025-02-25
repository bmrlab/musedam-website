import { ReactNode } from "react"

export enum EPlanProductType {
    PERSON_FREE = 'PERSON_FREE', // 个人免费
    // 海外
    PERSON_PRO = 'PERSON_PRO', // 个人 PRO
    PERSON_PRO_PLUS = 'PERSON_PRO_PLUS', // 个人 PRO Plus
    PERSON_PRO_MASTER = 'PERSON_PRO_MASTER', // 个人 PRO Master

    TEAM_BASIC = 'TEAM_BASIC', // 团队入门版
    TEAM_PRO = 'TEAM_PRO', // 团队专业版
    TEAM_FLAGSHIP = 'TEAM_FLAGSHIP', // 团队旗舰版
    ENTERPRISE = 'ENTERPRISE', // 企业版

    // 国内
    PERSON_PRO_YEAR = 'PERSON_PRO_YEAR', // 个人 PRO 年费
    PERSON_PRO_PLUS_YEAR = 'PERSON_PRO_PLUS_YEAR', // 个人 PRO Plus 年费
    PERSON_PRO_MONTH = 'PERSON_PRO_MONTH', // 个人 PRO 月费
    PERSON_PRO_SEASON = 'PERSON_PRO_SEASON', // 个人 PRO 季费

}
export enum BillingType {
    'monthly' = 'monthly',
    'yearly' = 'yearly'
}
export enum ESpaceType {
    PERSON_FREE = 'PERSON_FREE',
    PERSON_PRO = 'PERSON_PRO',
    TEAM = 'TEAM',
    ENTERPRISE = 'ENTERPRISE',
}

export enum PlanType {
    'personal' = 'personal',
    'team' = 'team'
}

interface CommonLink {
    type: "common",
    text: string,
    link: string
}
interface fileSupportLink {
    type: "fileSupport",
}
export interface PlanDetailInfo {
    group: string
    items: Array<{
        key?: string
        label: string
        showSparkles?: boolean
        hintText: string
        hintLink?: string
        hintLinkCustom?: CommonLink | fileSupportLink
        plans: Record<ESpaceType, ReactNode>
    }>
}
