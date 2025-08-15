import { EAdvancedModules, EPrivateModules } from './config'

export enum TabEnum {
    BASIC = 'basic',
    ADVANCED = 'advanced',
    PRIVATE = 'private'
}

export interface ICustomerInfo {
    company: string,
    contact: string,
    email: string,
    yourEmail: string
}

export interface IAdvancedInfo {
    memberSeats: number,
    storageSpace: number,
    aiPoints: number,
}

export interface IPrivateConfig {
    licenseType: 'saas' | 'perpetual'
    memberSeats: number
}

export type IAdvancedModules = Record<EAdvancedModules, boolean | number>

export type IPrivateModules = Record<EAdvancedModules | EPrivateModules, boolean> & {
    maintenanceYears: number
}

export interface IBasicConfig {
    memberSeats: number,
    storageSpace: number,
    aiPoints: number
}

export enum EFeatureView {
    'OVERVIEW' = 'overview',
    'DETAIL' = 'detail'
} 