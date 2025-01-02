// 对应接口返回的 productType
export enum EMuseProductType {
    /** Pro PLUS 会员年费 */
    PERSON_PRO_ANNUAL = 0,
    /** Pro会员月费 */
    PERSON_PRO_MONTHLY = 4,
    /** MuseDAM 2个月会员体验包 */
    PERSON_PRO_2_MONTHS = 2,
    /** MuseDAM Pro会员季费包 */
    PERSON_PRO_SEASON = 3,
    /** 团队存储空间1T/年 */
    ORG_STORAGE_ANNUAL_1T = 5,
    /** 团队存储空间100G/年 */
    ORG_STORAGE_ANNUAL_100G = 6,
    /** 团队席位1个/年 */
    ORG_SEAT_EACH_PER_YEAR = 7,
    /** 入门版 */
    ORG_BASIC = 10,
    /** 专业版 */
    ORG_PROFESSION = 20,
    /** 旗舰版 */
    ORG_FLAGSHIP = 30,
    /** 定制版*/
    ORG_CUSTOM = 99,
    /** 团队体验版*/
    ORG_TRAIL = 8,
    /** 一个月入门版 */
    ORG_BASIC_MONTHLY = 11,
    /** 一个月专业版 */
    ORG_PROFESSION_MONTHLY = 21,
    /** 一个月旗舰版 */
    ORG_FLAGSHIP_MONTHLY = 31,
    /** 算力点数 */
    POINT = 27,
    /** 扩充席位 */
    SEAT = 29,
    /** 个人pro-月费（连续订阅） */
    PERSON_PRO_SIGN = 9,
    ORG_BASIC_SIGN = 12,
    ORG_PROFESSION_SIGN = 22,
    ORG_FLAGSHIP_SIGN = 32,

    /**---------- 1225新套餐 ------------------**/
    // 国内
    /** 新 PRO 会员年费 */
    PERSON_PRO_YEAR = 34,

    // 海外-团队
    /** 海外-团队入门版 年费 */
    ABROAD_ORG_BASIC_YEARLY = 35,
    /** 海外-团队入门版 月费 */
    ABROAD_ORG_BASIC_MONTHLY = 36,
    /** 海外-团队专业版 年费 */
    ABROAD_ORG_PROFESSION_YEARLY = 37,
    /** 海外-团队专业版 月费 */
    ABROAD_ORG_PROFESSION_MONTHLY = 38,
    /** 海外-团队旗舰版 年费 */
    ABROAD_ORG_FLAGSHIP_YEARLY = 39,
    /** 海外-团队旗舰版 月费 */
    ABROAD_ORG_FLAGSHIP_MONTHLY = 40,

    // 海外-个人
    /** 海外-个人PRO 年费 */
    ABROAD_PERSON_PRO_YEARLY = 41,
    /** 海外-个人PRO 月费 */
    ABROAD_PERSON_PRO_MONTHLY = 42,
    /** 海外-个人PRO PLUS 年费 */
    ABROAD_PERSON_PRO_PLUS_YEARLY = 43,
    /** 海外-个人PRO PLUS 月费  */
    ABROAD_PERSON_PRO_PLUS_MONTHLY = 44,
    /** 海外-个人PRO MASTER 年费 */
    ABROAD_PERSON_PRO_MASTER_YEARLY = 45,
    /** 海外-个人PRO MASTER 月费 */
    ABROAD_PERSON_PRO_MASTER_MONTHLY = 46,
}



export const OrgPackageMapping: Record<number, string> = {
    [EMuseProductType.PERSON_PRO_YEAR]: 'Pro会员年费',
    [EMuseProductType.PERSON_PRO_ANNUAL]: 'Pro Plus会员年费',
    [EMuseProductType.PERSON_PRO_MONTHLY]: 'Pro会员月费',
    [EMuseProductType.PERSON_PRO_2_MONTHS]: 'MuseDAM 2个月会员体验包',
    [EMuseProductType.PERSON_PRO_SEASON]: 'MuseDAM Pro会员季费包',
    [EMuseProductType.ORG_STORAGE_ANNUAL_1T]: '团队存储空间1T/年',
    [EMuseProductType.ORG_STORAGE_ANNUAL_100G]: '团队存储空间100G/年',
    [EMuseProductType.ORG_SEAT_EACH_PER_YEAR]: '团队席位1个/年',
    [EMuseProductType.ORG_BASIC]: '入门版',
    [EMuseProductType.ORG_PROFESSION]: '专业版',
    [EMuseProductType.ORG_FLAGSHIP]: '旗舰版',
    [EMuseProductType.ORG_CUSTOM]: '定制版',
    [EMuseProductType.ORG_TRAIL]: '体验版',
    [EMuseProductType.ORG_BASIC_MONTHLY]: '一个月入门版',
    [EMuseProductType.ORG_PROFESSION_MONTHLY]: '一个月专业版',
    [EMuseProductType.ORG_FLAGSHIP_MONTHLY]: '一个月旗舰版',
    [EMuseProductType.ORG_BASIC_SIGN]: '入门版',
    [EMuseProductType.ORG_PROFESSION_SIGN]: '入门版',
    [EMuseProductType.ORG_FLAGSHIP_SIGN]: '入门版',
    [EMuseProductType.PERSON_PRO_SIGN]: 'Pro会员连续包月',
    [EMuseProductType.ABROAD_ORG_BASIC_YEARLY]: '海外-团队入门版年费',
    [EMuseProductType.ABROAD_ORG_BASIC_MONTHLY]: '海外-团队入门版月费',
    [EMuseProductType.ABROAD_ORG_PROFESSION_YEARLY]: '海外-团队专业版年费',
    [EMuseProductType.ABROAD_ORG_PROFESSION_MONTHLY]: '海外-团队专业版月费',
    [EMuseProductType.ABROAD_ORG_FLAGSHIP_YEARLY]: '海外-团队旗舰版年费',
    [EMuseProductType.ABROAD_ORG_FLAGSHIP_MONTHLY]: '海外-团队旗舰版月费',
    [EMuseProductType.ABROAD_PERSON_PRO_YEARLY]: '海外-个人PRO年费',
    [EMuseProductType.ABROAD_PERSON_PRO_MONTHLY]: '海外-个人PRO月费',
    [EMuseProductType.ABROAD_PERSON_PRO_PLUS_YEARLY]: '海外-个人PRO PLUS年费',
    [EMuseProductType.ABROAD_PERSON_PRO_PLUS_MONTHLY]: '海外-个人PRO PLUS月费',
    [EMuseProductType.ABROAD_PERSON_PRO_MASTER_YEARLY]: '海外-个人PRO MASTER年费',
    [EMuseProductType.ABROAD_PERSON_PRO_MASTER_MONTHLY]: '海外-个人PRO MASTER月费'
}
/** 埋点用 */
export const getPlanNameByProductType = (productType?: number, fallback?: string) => {
    if (typeof Number(productType) === 'number') {
        return OrgPackageMapping[Number(productType)] || fallback
    }
    return fallback
}