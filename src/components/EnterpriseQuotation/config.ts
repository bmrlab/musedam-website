// 價格配置
export const pricing = {
    basic: {
        baseCost: 0,
        memberSeatPrice: 300,
        storageSpacePrice: 120,
        aiPointsPrice: 1000
    },
    advanced: {
        baseCost: 0,
        memberSeatPrice: 300,
        storageSpacePrice: 120,
        aiPointsPrice: 1000,
        modules: {
            advancedFeatures: 5000,
            customSystemHomepage: 5000,
            approvalWorkflow: 15000,
            complianceCheck: 15000,
            customMetadataFields: 15000,
            watermark: 2000,
            enterpriseSSO: 2000,
            customerService: 0,
            professionalServices: 15000
        }
    },
    private: {
        saasBaseCost: 9000,
        perpetualBaseCost: 9000,
        memberSeatPrice: 300,
        modules: {
            advancedFeatures: 5000,
            customSystemHomepage: 5000,
            approvalWorkflow: 15000,
            complianceCheck: 15000,
            customMetadataFields: 15000,
            watermark: 2000,
            enterpriseSSO: 1000,
            customerService: 0,
            professionalServices: 15000,
            privateImplementation: 18000,
            operationMaintenance: 5000
        }
    }
}

export const BasicConfigs = [
    {
        key: 'memberSeats',
        title: 'Member Seats',
        hint: ['Admin, Contributor, and Member roles configurable'],
        des: '$300/seat/year ($25/seat/month)'
    },
    {
        key: 'storageSpace',
        title: 'Storage Space',
        hint: ['Monthly download traffic follows storage size'],
        des: '$120/GB/year ($10/GB/month)'
    },
    {
        key: 'aiPoints',
        title: 'AI Points',
        hint: [
            '4,000 points/month',
            'Issued monthly, reset on the 1st of each month'
        ],
        des: '$1000/year (appr. $0.02/point)'
    },
]

export const AdvancedConfigs = [
    {
        key: 'memberSeats',
        title: 'Member Seats',
        hint: ['Admin, Contributor, and Member roles configurable'],
        des: '$300/seat/year ($25/seat/month)'
    },
    {
        key: 'storageSpace',
        title: 'Storage Space',
        hint: ['Monthly download traffic follows storage size'],
        des: '$1,200/TB/year ($100/T/month)'
    },
    {
        key: 'aiPoints',
        title: 'AI Points',
        hint: [
            '4,000 points/month',
            'Issued monthly, reset on the 1st of each month'
        ],
        des: '$1000/year (appr. $0.02/point)'
    },
]
