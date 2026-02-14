
import { useTranslation } from 'react-i18next';
import { EAdvancedModules, EBasicConfigKey } from '../../EnterpriseQuotation/config'
import { useCountry } from '@/providers/Country';

export const useEnterprisePlan = () => {
    const { t: tFeatures } = useTranslation('pricing-enterprise-features');
    const { isInChina } = useCountry()

    // Basic
    const basicList = {
        [tFeatures('aiCapabilities.title')]: [
            { name: tFeatures('aiCapabilities.0.name'), detail: tFeatures('aiCapabilities.0.detail') },
            { name: tFeatures('aiCapabilities.1.name'), detail: tFeatures('aiCapabilities.1.detail') },
            { name: tFeatures('aiCapabilities.2.name'), detail: tFeatures('aiCapabilities.2.detail') },
            { name: tFeatures('aiCapabilities.3.name'), detail: tFeatures('aiCapabilities.3.detail') },
            { name: tFeatures('aiCapabilities.4.name'), detail: tFeatures('aiCapabilities.4.detail') }
        ],
        [tFeatures('storageManagement.title')]: [
            { name: tFeatures('storageManagement.0.name'), detail: tFeatures('storageManagement.0.detail') },
            { name: tFeatures('storageManagement.1.name'), detail: tFeatures('storageManagement.1.detail') },
            { name: tFeatures('storageManagement.2.name'), detail: tFeatures('storageManagement.2.detail') }
        ],
        [tFeatures('assetOrganization.title')]: Array.from({ length: 10 }).map((_, i) => ({
            name: tFeatures(`assetOrganization.${i}.name`), detail: tFeatures(`assetOrganization.${i}.detail`)
        })),
        [tFeatures('sharingCollaboration.title')]: [
            { name: tFeatures('sharingCollaboration.0.name'), detail: tFeatures('sharingCollaboration.0.detail') },
            { name: tFeatures('sharingCollaboration.1.name'), detail: tFeatures('sharingCollaboration.1.detail') },
            { name: tFeatures('sharingCollaboration.2.name'), detail: tFeatures('sharingCollaboration.2.detail') },
            { name: tFeatures('sharingCollaboration.3.name'), detail: tFeatures('sharingCollaboration.3.detail') },
            { name: tFeatures('sharingCollaboration.4.name'), detail: tFeatures('sharingCollaboration.4.detail') }
        ],
        [tFeatures('analyticsMonitoring.title')]: [
            { name: tFeatures('analyticsMonitoring.0.name'), detail: tFeatures('analyticsMonitoring.0.detail') },
            { name: tFeatures('analyticsMonitoring.1.name'), detail: tFeatures('analyticsMonitoring.1.detail') },
            { name: tFeatures('analyticsMonitoring.2.name'), detail: tFeatures('analyticsMonitoring.2.detail') }
        ],
        [tFeatures('extensions.title')]: [
            { name: tFeatures('extensions.0.name'), detail: tFeatures('extensions.0.detail') },
            { name: tFeatures('extensions.1.name'), detail: tFeatures('extensions.1.detail') },
            ...(!isInChina ? [] : [{ name: tFeatures('extensions.2.name'), detail: tFeatures('extensions.2.detail') }])
        ]
    };

    // Advanced
    const advancedList = {
        [tFeatures('advancedFeatures.title')]: [
            { name: tFeatures('advancedFeatures.0.name'), detail: tFeatures('advancedFeatures.0.detail'), showBeta: true },
            { name: tFeatures('advancedFeatures.1.name'), detail: tFeatures('advancedFeatures.1.detail') },
            { name: tFeatures('advancedFeatures.2.name'), detail: tFeatures('advancedFeatures.2.detail') },
            { name: tFeatures('advancedFeatures.3.name'), detail: tFeatures('advancedFeatures.3.detail') },
            { name: tFeatures('advancedFeatures.4.name'), detail: tFeatures('advancedFeatures.4.detail') },
            { name: tFeatures('advancedFeatures.5.name'), detail: tFeatures('advancedFeatures.5.detail') },
            { name: tFeatures('advancedFeatures.6.name'), detail: tFeatures('advancedFeatures.6.detail') },
            { name: tFeatures('advancedFeatures.7.name'), detail: tFeatures('advancedFeatures.7.detail') }
        ],
        [tFeatures('customSystemHomepage.title')]: [
            { name: tFeatures('customSystemHomepage.0.name'), detail: tFeatures('customSystemHomepage.0.detail') },
            { name: tFeatures('customSystemHomepage.1.name'), detail: tFeatures('customSystemHomepage.1.detail') },
            { name: tFeatures('customSystemHomepage.2.name'), detail: tFeatures('customSystemHomepage.2.detail') },
            { name: tFeatures('customSystemHomepage.3.name'), detail: tFeatures('customSystemHomepage.3.detail') },
            { name: tFeatures('customSystemHomepage.4.name'), detail: tFeatures('customSystemHomepage.4.detail') },
            { name: tFeatures('customSystemHomepage.5.name'), detail: tFeatures('customSystemHomepage.5.detail') }
        ],
        [tFeatures('smartFolders.title')]: [
            { name: tFeatures('smartFolders.0.name'), detail: tFeatures('smartFolders.0.detail') },
            { name: tFeatures('smartFolders.1.name'), detail: tFeatures('smartFolders.1.detail') },
            { name: tFeatures('smartFolders.2.name'), detail: tFeatures('smartFolders.2.detail') },
            { name: tFeatures('smartFolders.3.name'), detail: tFeatures('smartFolders.3.detail') }
        ],
        [tFeatures('deliveryApprovalCenter.title')]: [
            { name: tFeatures('deliveryApprovalCenter.0.name'), detail: tFeatures('deliveryApprovalCenter.0.detail') },
            { name: tFeatures('deliveryApprovalCenter.1.name'), detail: tFeatures('deliveryApprovalCenter.1.detail') },
            { name: tFeatures('deliveryApprovalCenter.2.name'), detail: tFeatures('deliveryApprovalCenter.2.detail') },
            { name: tFeatures('deliveryApprovalCenter.3.name'), detail: tFeatures('deliveryApprovalCenter.3.detail') },
            { name: tFeatures('deliveryApprovalCenter.4.name'), detail: tFeatures('deliveryApprovalCenter.4.detail') },
            { name: tFeatures('deliveryApprovalCenter.5.name'), detail: tFeatures('deliveryApprovalCenter.5.detail') }
        ],
        [tFeatures('publicAssetsAndDerivatives.title')]: [
            { name: tFeatures('publicAssetsAndDerivatives.0.name'), detail: tFeatures('publicAssetsAndDerivatives.0.detail') },
            { name: tFeatures('publicAssetsAndDerivatives.1.name'), detail: tFeatures('publicAssetsAndDerivatives.1.detail') },
            { name: tFeatures('publicAssetsAndDerivatives.2.name'), detail: tFeatures('publicAssetsAndDerivatives.2.detail') },
            { name: tFeatures('publicAssetsAndDerivatives.3.name'), detail: tFeatures('publicAssetsAndDerivatives.3.detail') },
            { name: tFeatures('publicAssetsAndDerivatives.4.name'), detail: tFeatures('publicAssetsAndDerivatives.4.detail') }
        ],
        [tFeatures('dat.title')]: [
            { name: tFeatures('dat.0.name'), detail: tFeatures('dat.0.detail') },
            { name: tFeatures('dat.1.name'), detail: tFeatures('dat.1.detail') },
            { name: tFeatures('dat.2.name'), detail: tFeatures('dat.2.detail') },
            { name: tFeatures('dat.3.name'), detail: tFeatures('dat.3.detail') }
        ],
        [tFeatures('customMetadataFields.title')]: [
            { name: tFeatures('customMetadataFields.0.name'), detail: tFeatures('customMetadataFields.0.detail') },
            { name: tFeatures('customMetadataFields.1.name'), detail: tFeatures('customMetadataFields.1.detail') },
            { name: tFeatures('customMetadataFields.2.name'), detail: tFeatures('customMetadataFields.2.detail') }
        ],
        [tFeatures('aiAutoTaggingEngine.title')]: [
            { name: tFeatures('aiAutoTaggingEngine.0.name'), detail: tFeatures('aiAutoTaggingEngine.0.detail') },
            { name: tFeatures('aiAutoTaggingEngine.1.name'), detail: tFeatures('aiAutoTaggingEngine.1.detail') },
            { name: tFeatures('aiAutoTaggingEngine.2.name'), detail: tFeatures('aiAutoTaggingEngine.2.detail') },
            { name: tFeatures('aiAutoTaggingEngine.3.name'), detail: tFeatures('aiAutoTaggingEngine.3.detail') },
            { name: tFeatures('aiAutoTaggingEngine.4.name'), detail: tFeatures('aiAutoTaggingEngine.4.detail') },
            { name: tFeatures('aiAutoTaggingEngine.5.name'), detail: tFeatures('aiAutoTaggingEngine.5.detail') }
        ],
        // 合规检测
        [tFeatures('complianceCheck.title')]: [
            { name: tFeatures('complianceCheck.0.name'), detail: tFeatures('complianceCheck.0.detail') },
            { name: tFeatures('complianceCheck.1.name'), detail: tFeatures('complianceCheck.1.detail') },
            { name: tFeatures('complianceCheck.2.name'), detail: tFeatures('complianceCheck.2.detail') }
        ],
        // 版权管理
        [tFeatures('copyrightManagement.title')]: [
            { name: tFeatures('copyrightManagement.0.name'), detail: tFeatures('copyrightManagement.0.detail') },
            { name: tFeatures('copyrightManagement.1.name'), detail: tFeatures('copyrightManagement.1.detail') },
            { name: tFeatures('copyrightManagement.2.name'), detail: tFeatures('copyrightManagement.2.detail') },
            { name: tFeatures('copyrightManagement.3.name'), detail: tFeatures('copyrightManagement.3.detail') }
        ],
        // 标注项目库
        [tFeatures('standardProjectHub.title')]: [
            { name: tFeatures('standardProjectHub.0.name'), detail: tFeatures('standardProjectHub.0.detail') },
            { name: tFeatures('standardProjectHub.1.name'), detail: tFeatures('standardProjectHub.1.detail') },
            { name: tFeatures('standardProjectHub.2.name'), detail: tFeatures('standardProjectHub.2.detail') },
            { name: tFeatures('standardProjectHub.3.name'), detail: tFeatures('standardProjectHub.3.detail') },
            { name: tFeatures('standardProjectHub.4.name'), detail: tFeatures('standardProjectHub.4.detail') },
        ],
        // 高级项目库
        [tFeatures('advancedProjectHub.title')]: [
            { name: tFeatures('advancedProjectHub.0.name'), detail: tFeatures('advancedProjectHub.0.detail') },
            { name: tFeatures('advancedProjectHub.1.name'), detail: tFeatures('advancedProjectHub.1.detail') },
            { name: tFeatures('advancedProjectHub.2.name'), detail: tFeatures('advancedProjectHub.2.detail') },
            { name: tFeatures('advancedProjectHub.3.name'), detail: tFeatures('advancedProjectHub.3.detail') },
            { name: tFeatures('advancedProjectHub.4.name'), detail: tFeatures('advancedProjectHub.4.detail') },
            { name: tFeatures('advancedProjectHub.5.name'), detail: tFeatures('advancedProjectHub.5.detail') },
        ],
        [tFeatures('museAI.title')]: [
            { name: tFeatures('museAI.block.0') },
            { name: tFeatures('museAI.1.name'), detail: tFeatures('museAI.1.detail') },
            { name: tFeatures('museAI.2.name'), detail: tFeatures('museAI.2.detail') },
            { name: tFeatures('museAI.3.name'), detail: tFeatures('museAI.3.detail') },
            { name: tFeatures('museAI.block.1') },
            { name: tFeatures('museAI.4.name'), detail: tFeatures('museAI.4.detail') },
            { name: tFeatures('museAI.5.name'), detail: tFeatures('museAI.5.detail') },
            { name: tFeatures('museAI.6.name'), detail: tFeatures('museAI.6.detail') },
            { name: tFeatures('museAI.7.name'), detail: tFeatures('museAI.7.detail') },
            { name: tFeatures('museAI.8.name'), detail: tFeatures('museAI.8.detail') },
            { name: tFeatures('museAI.block.2') },
            { name: tFeatures('museAI.9.name'), detail: tFeatures('museAI.9.detail') },
            { name: tFeatures('museAI.10.name'), detail: tFeatures('museAI.10.detail') },
            { name: tFeatures('museAI.11.name'), detail: tFeatures('museAI.11.detail') },
            { name: tFeatures('museAI.12.name'), detail: tFeatures('museAI.12.detail') },
            { name: tFeatures('museAI.13.name'), detail: tFeatures('museAI.13.detail') }
        ],
        [tFeatures('batchTemplating.title')]: [
            { name: tFeatures('batchTemplating.0.name'), detail: tFeatures('batchTemplating.0.detail') },
            { name: tFeatures('batchTemplating.1.name'), detail: tFeatures('batchTemplating.1.detail') },
            { name: tFeatures('batchTemplating.2.name'), detail: tFeatures('batchTemplating.2.detail') },
            { name: tFeatures('batchTemplating.3.name'), detail: tFeatures('batchTemplating.3.detail') },
            { name: tFeatures('batchTemplating.4.name'), detail: tFeatures('batchTemplating.4.detail') }
        ],
        [tFeatures('museCut.title')]: [
            { name: tFeatures('museCut.0.name'), detail: tFeatures('museCut.0.detail') },
            { name: tFeatures('museCut.1.name'), detail: tFeatures('museCut.1.detail') },
            { name: tFeatures('museCut.2.name'), detail: tFeatures('museCut.2.detail') }
        ],
        [tFeatures('watermark.title')]: [
            { name: tFeatures('watermark.0.name'), detail: tFeatures('watermark.0.detail') },
            { name: tFeatures('watermark.1.name'), detail: tFeatures('watermark.1.detail') },
            { name: tFeatures('watermark.2.name'), detail: tFeatures('watermark.2.detail') }
        ],
        [tFeatures('enterpriseSingleSignOn.title')]: [
            ...(isInChina ? [
                { name: tFeatures('enterpriseSingleSignOn.0.name'), detail: tFeatures('enterpriseSingleSignOn.0.detail'), key: EAdvancedModules.SSO_FEISHU },
                { name: tFeatures('enterpriseSingleSignOn.1.name'), detail: tFeatures('enterpriseSingleSignOn.1.detail'), key: EAdvancedModules.SSO_WECOM },
                { name: tFeatures('enterpriseSingleSignOn.2.name'), detail: tFeatures('enterpriseSingleSignOn.2.detail'), key: EAdvancedModules.SSO_DINGTALK },
            ] : []),
            { name: tFeatures('enterpriseSingleSignOn.3.name'), detail: tFeatures('enterpriseSingleSignOn.3.detail'), key: EAdvancedModules.SSO_Teams }
        ],
        ...(!isInChina ? {} : {
            [tFeatures('globalAcceleration.title')]: [
                { name: tFeatures('globalAcceleration.block.0') },
                { name: tFeatures('globalAcceleration.0.name'), detail: tFeatures('globalAcceleration.0.detail') },
                { name: tFeatures('globalAcceleration.1.name'), detail: tFeatures('globalAcceleration.1.detail') },
                { name: tFeatures('globalAcceleration.2.name'), detail: tFeatures('globalAcceleration.2.detail') },
                { name: tFeatures('globalAcceleration.block.1') },
                { name: tFeatures('globalAcceleration.3.name'), detail: tFeatures('globalAcceleration.3.detail') },
                { name: tFeatures('globalAcceleration.4.name'), detail: tFeatures('globalAcceleration.4.detail') },
                { name: tFeatures('globalAcceleration.5.name'), detail: tFeatures('globalAcceleration.5.detail') },
            ]
        }),
        [tFeatures('customerService.title')]: [
            { name: tFeatures('customerService.0.name'), detail: tFeatures('customerService.0.detail') }
        ],
    };

    // Value-Added Services
    const addedList = {
        [tFeatures('capacityExpansion.title')]: [
            { name: tFeatures('capacityExpansion.0.name'), detail: tFeatures('capacityExpansion.0.detail') },
            { name: tFeatures('capacityExpansion.1.name'), detail: tFeatures('capacityExpansion.1.detail') },
            { name: tFeatures('capacityExpansion.2.name'), detail: tFeatures('capacityExpansion.2.detail') },
            { name: tFeatures('capacityExpansion.3.name'), detail: tFeatures('capacityExpansion.3.detail') },
            ...(isInChina ? [{ name: tFeatures('capacityExpansion.4.name'), detail: tFeatures('capacityExpansion.4.detail') }] : []),
        ],
        [tFeatures('professionalServicesSupport.title')]: [
            { name: tFeatures('professionalServicesSupport.0.name'), detail: tFeatures('professionalServicesSupport.0.detail') },
            { name: tFeatures('professionalServicesSupport.1.name'), detail: tFeatures('professionalServicesSupport.1.detail') },
            { name: tFeatures('professionalServicesSupport.2.name'), detail: tFeatures('professionalServicesSupport.2.detail') },
        ]
    };

    const allFeature = {
        basic: {
            title: tFeatures('Basic'),
            list: basicList
        },
        advanced: {
            title: tFeatures('Advanced'),
            list: advancedList
        },
        added: {
            title: tFeatures('ValueAddedServices'),
            list: addedList
        }
    };

    // Stable group structures (code-keyed) for mapping with enums
    const basicGroupsByCode = {
        aiCapabilities: { title: tFeatures('aiCapabilities.title'), items: basicList[tFeatures('aiCapabilities.title')] },
        storageManagement: { title: tFeatures('storageManagement.title'), items: basicList[tFeatures('storageManagement.title')] },
        assetOrganization: { title: tFeatures('assetOrganization.title'), items: basicList[tFeatures('assetOrganization.title')] },
        sharingCollaboration: { title: tFeatures('sharingCollaboration.title'), items: basicList[tFeatures('sharingCollaboration.title')] },
        analyticsMonitoring: { title: tFeatures('analyticsMonitoring.title'), items: basicList[tFeatures('analyticsMonitoring.title')] },
        extensions: { title: tFeatures('extensions.title'), items: basicList[tFeatures('extensions.title')] },
    } as const;

    const advancedGroupsByCode = {
        advancedFeatures: { title: tFeatures('advancedFeatures.title'), items: advancedList[tFeatures('advancedFeatures.title')].slice(1) },
        customSystemHomepage: { title: tFeatures('customSystemHomepage.title'), items: advancedList[tFeatures('customSystemHomepage.title')] },
        standardProjectHub: { title: tFeatures('standardProjectHub.title'), items: advancedList[tFeatures('standardProjectHub.title')] },
        advancedProjectHub: { title: tFeatures('advancedProjectHub.title'), items: advancedList[tFeatures('advancedProjectHub.title')] },
        aiAutoTaggingEngine: { title: tFeatures('aiAutoTaggingEngine.title'), items: advancedList[tFeatures('aiAutoTaggingEngine.title')] },
        museAI: { title: tFeatures('museAI.title'), items: advancedList[tFeatures('museAI.title')] },
        batchTemplating: { title: tFeatures('batchTemplating.title'), items: advancedList[tFeatures('batchTemplating.title')] },
        museCut: { title: tFeatures('museCut.title'), items: advancedList[tFeatures('museCut.title')] },
        complianceCheck: { title: tFeatures('complianceCheck.title'), items: advancedList[tFeatures('complianceCheck.title')] },
        deliveryApprovalCenter: { title: tFeatures('deliveryApprovalCenter.title'), items: advancedList[tFeatures('deliveryApprovalCenter.title')] },
        smartFolders: { title: tFeatures('smartFolders.title'), items: advancedList[tFeatures('smartFolders.title')] },
        publicAssetsAndDerivatives: { title: tFeatures('publicAssetsAndDerivatives.title'), items: advancedList[tFeatures('publicAssetsAndDerivatives.title')] },
        dat: { title: tFeatures('dat.title'), items: advancedList[tFeatures('dat.title')] },
        copyrightManagement: { title: tFeatures('copyrightManagement.title'), items: advancedList[tFeatures('copyrightManagement.title')] },
        customMetadataFields: { title: tFeatures('customMetadataFields.title'), items: advancedList[tFeatures('customMetadataFields.title')] },
        watermark: { title: tFeatures('watermark.title'), items: advancedList[tFeatures('watermark.title')] },
        enterpriseSingleSignOn: { title: tFeatures('enterpriseSingleSignOn.title'), items: advancedList[tFeatures('enterpriseSingleSignOn.title')] },
        globalAcceleration: { title: tFeatures('globalAcceleration.title'), items: advancedList[tFeatures('globalAcceleration.title')] },
        customerService: { title: tFeatures('customerService.title'), items: advancedList[tFeatures('customerService.title')] },
    } as const;

    // Enum key to group-code mapping for Quotation usage
    const basicKeyToGroups: Record<EBasicConfigKey, (keyof typeof basicGroupsByCode)[]> = {
        [EBasicConfigKey.MEMBER_SEATS]: ['assetOrganization', 'sharingCollaboration'],
        [EBasicConfigKey.STORAGE_SPACE]: ['storageManagement'],
        [EBasicConfigKey.AI_POINTS]: ['aiCapabilities', 'extensions', 'analyticsMonitoring'],
    };

    const advancedKeyToGroup: Partial<Record<EAdvancedModules, keyof typeof advancedGroupsByCode>> = {
        [EAdvancedModules.ADVANCED_FEATURES]: 'advancedFeatures',
        [EAdvancedModules.CUSTOM_SYSTEM_HOMEPAGE]: 'customSystemHomepage',
        [EAdvancedModules.STANDARD_PROJECT_HUB]: 'standardProjectHub',
        [EAdvancedModules.ADVANCED_PROJECT_HUB]: 'advancedProjectHub',
        [EAdvancedModules.AI_AUTO_TAG]: 'aiAutoTaggingEngine',
        [EAdvancedModules.MUSE_AI]: 'museAI',
        [EAdvancedModules.MUSE_CUT]: 'museCut',
        [EAdvancedModules.COMPLIANCE_CHECK]: 'complianceCheck',
        [EAdvancedModules.DELIVERY_APPROVAL_CENTER]: 'deliveryApprovalCenter',
        [EAdvancedModules.SMART_FOLDERS]: 'smartFolders',
        [EAdvancedModules.PUBLIC_ASSETS_AND_DERIVATIVES]: 'publicAssetsAndDerivatives',
        [EAdvancedModules.DAT]: 'dat',
        [EAdvancedModules.COPYRIGHT_MANAGEMENT]: 'copyrightManagement',
        [EAdvancedModules.CUSTOM_METADATA_FIELDS]: 'customMetadataFields',
        [EAdvancedModules.WATERMARK]: 'watermark',
        [EAdvancedModules.ENTERPRISE_SSO]: 'enterpriseSingleSignOn',
        [EAdvancedModules.GA]: 'globalAcceleration',
        [EAdvancedModules.CUSTOMER_SERVICE]: 'customerService',
    };

    return { allFeature, basicGroupsByCode, advancedGroupsByCode, basicKeyToGroups, advancedKeyToGroup };
};    