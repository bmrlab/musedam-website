import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const HelpCategories: CollectionConfig = {
    slug: 'help-categories',
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: 'title',
        group: 'Help Center',
        description: '管理帮助中心的分类',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            localized: true,
            required: true,
            label: '分类名称',
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: 'URL标识',
            admin: {
                description: '用于URL的唯一标识符',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
            label: '分类描述',
            admin: {
                description: '分类的简要描述',
            },
        },
        {
            name: 'topic',
            type: 'relationship',
            relationTo: 'help-topics',
            required: true,
            label: '所属专题',
            admin: {
                description: '选择该分类属于哪个专题',
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