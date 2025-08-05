import { FC } from 'react'
import { EFeatureView, useQuotationContext } from './index'
import { useTranslation } from '@/app/i18n/client'

export const FeatureList: FC = () => {
    const {
        featureView
    } = useQuotationContext()
    const { t } = useTranslation('quotation-feature')
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'

    // 基础功能
    const basicList = [
        {
            name: t('basic.storageManagement'),
            value: t('basic.storageManagement.value'),
        },
        {
            name: t('basic.aiCapabilities'),
            value: t('basic.aiCapabilities.value'),
        },
        {
            name: t('basic.assetOrganization'),
            value: t('basic.assetOrganization.value'),
        },
        {
            name: t('basic.sharingAndCollaboration'),
            value: t('basic.sharingAndCollaboration.value'),
        },
        {
            name: t('basic.analyticsAndMonitoring'),
            value: t('basic.analyticsAndMonitoring.value'),
        },
    ]
    // 高级功能

    const advancedList = [

        {
            name: t('advanced.advancedFeatures'),
            value: t('advanced.advancedFeatures.value'),
        },
        {
            name: t('advanced.customSystemHomepage'),
            value: t('advanced.customSystemHomepage.value'),
        },
        {
            name: t('advanced.approvalWorkflow'),
            value: t('advanced.approvalWorkflow.value'),
        },
        {
            name: t('advanced.complianceCheck'),
            value: t('advanced.complianceCheck.value'),
        },
        {
            name: t('advanced.customMetadataFields'),
            value: t('advanced.customMetadataFields.value'),
        },
        {
            name: t('advanced.watermark'),
            value: t('advanced.watermark.value'),
        },
        {
            name: t('advanced.enterpriseSso'),
            value: t('advanced.enterpriseSso.value'),
        },
        {
            name: t('advanced.customerService'),
            value: t('advanced.customerService.value'),
        }
    ];

    return (
        <div className='mt-[50px]'>
            <h3 className="mb-[30px] text-2xl font-bold text-[#141414]">{t('features.title')}</h3>
            <div className='overflow-hidden rounded-2xl border'>
                {/* 基础功能 */}
                <div className="flex h-[60px] items-center border-b bg-[#F9FAFB] px-6 text-xl font-bold">
                    {t('basic.title')}
                </div>
                <div >
                    {basicList.map(({ name, value }) => (
                        <div
                            className="grid grid-cols-5 justify-between border-t px-6 py-[18px] transition-colors"
                            key={name}
                        >
                            <div className='col-span-2 flex items-center'>
                                <span className="text-xl font-medium">{name}</span>
                            </div>
                            <div className="col-span-3 whitespace-pre-line text-start text-lg">
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 高级功能*/}
            {featureView === EFeatureView.DETAIL &&
                <div className='mt-[30px] overflow-hidden rounded-2xl border'>
                    <div className="flex h-[60px] items-center border-b bg-[#F9FAFB] px-6 text-xl font-bold">
                        {t('advanced.title')}
                    </div>
                    <div className="space-y-0 text-xl">
                        {advancedList.map(({ name, value }) => (
                            <div
                                className="grid grid-cols-5 justify-between border-t px-6 py-[18px] transition-colors"
                                key={name}
                            >
                                <div className='col-span-2 flex items-center'>
                                    <span className="text-xl font-medium">{name}</span>
                                </div>
                                <div className="col-span-3 whitespace-pre-line text-start text-lg">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
        </div>
    );
}

