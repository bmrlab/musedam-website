import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const HelpTopics: CollectionConfig = {
    slug: 'help-topics',
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: 'title',
        group: 'Help Center',
        description: '管理帮助中心的专题模块',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            localized: true,
            required: true,
            label: '专题名称',
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: 'URL标识',
            admin: {
                description: '用于URL的唯一标识符，如: getting-started',
            },
        },
        {
            name: 'coverImage',
            type: 'upload',
            relationTo: 'media',
            label: '封面图',
            admin: {
                description: '专题的封面图片，建议尺寸: 400x300px，支持PNG、JPG、SVG格式',
            },
            filterOptions: {
                mimeType: {
                    in: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
                },
            },
        },
        {
            name: 'bullets',
            type: 'array',
            label: 'Bullets描述',
            admin: {
                description: '显示在卡片上的要点描述',
            },
            fields: [
                {
                    name: 'text',
                    type: 'text',
                    required: true,
                    label: '描述文本',
                    localized: true,
                },
            ],
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
            label: '一句话描述',
            admin: {
                description: '显示在专题详情页的描述',
            },
        },
        {
            name: 'index',
            type: 'number',
            label: '排序索引',
            admin: {
                description: '数字越小排序越靠前',
            },
            defaultValue: 999,
        },
        {
            name: '_status',
            type: 'select',
            options: [
                { label: '已发布', value: 'published' },
                { label: '草稿', value: 'draft' },
            ],
            defaultValue: 'draft',
            admin: {
                position: 'sidebar',
            },
        },
    ],
    timestamps: true,
} 