
import { useCountry } from '@/providers/Country';
import { useTranslation } from 'react-i18next';

export const useEnterprisePlan = () => {
    const { t } = useTranslation('pricing');
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
            ...(!isInChina ? [] : [{ name: tFeatures('advancedFeatures.0.name'), detail: tFeatures('advancedFeatures.0.detail'), showBeta: true }]),
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
        ...(!isInChina ? {} : {
            [tFeatures('approvalWorkflow.title')]: [
                { name: tFeatures('approvalWorkflow.0.name'), detail: tFeatures('approvalWorkflow.0.detail') },
                { name: tFeatures('approvalWorkflow.1.name'), detail: tFeatures('approvalWorkflow.1.detail') },
                { name: tFeatures('approvalWorkflow.2.name'), detail: tFeatures('approvalWorkflow.2.detail') },
            ],
            [tFeatures('complianceCheck.title')]: [
                { name: tFeatures('complianceCheck.0.name'), detail: tFeatures('complianceCheck.0.detail') },
                { name: tFeatures('complianceCheck.1.name'), detail: tFeatures('complianceCheck.1.detail') },
                { name: tFeatures('complianceCheck.2.name'), detail: tFeatures('complianceCheck.2.detail') }
            ],
        }),
        [tFeatures('customMetadataFields.title')]: [
            { name: tFeatures('customMetadataFields.0.name'), detail: tFeatures('customMetadataFields.0.detail') },
            { name: tFeatures('customMetadataFields.1.name'), detail: tFeatures('customMetadataFields.1.detail') },
            { name: tFeatures('customMetadataFields.2.name'), detail: tFeatures('customMetadataFields.2.detail') }
        ],
        [tFeatures('watermark.title')]: [
            { name: tFeatures('watermark.0.name'), detail: tFeatures('watermark.0.detail') },
            { name: tFeatures('watermark.1.name'), detail: tFeatures('watermark.1.detail') },
            { name: tFeatures('watermark.2.name'), detail: tFeatures('watermark.2.detail') }
        ],
        ...(!isInChina ? {} : {
            [tFeatures('enterpriseSingleSignOn.title')]: [
                { name: tFeatures('enterpriseSingleSignOn.0.name'), detail: tFeatures('enterpriseSingleSignOn.0.detail') },
                { name: tFeatures('enterpriseSingleSignOn.1.name'), detail: tFeatures('enterpriseSingleSignOn.1.detail') },
                { name: tFeatures('enterpriseSingleSignOn.2.name'), detail: tFeatures('enterpriseSingleSignOn.2.detail') }
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
            { name: tFeatures('capacityExpansion.3.name'), detail: tFeatures('capacityExpansion.3.detail') }
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

    return { allFeature };
};    