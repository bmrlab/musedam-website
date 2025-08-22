import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import {
    BlocksFeature,
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
    lexicalEditor,
    LinkFeature,
} from '@payloadcms/richtext-lexical'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from '@payloadcms/plugin-seo/fields'
import type { CollectionConfig } from 'payload'

export const HelpDocuments: CollectionConfig = {
    slug: 'help-documents',
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: 'title',
        group: 'Help Center',
        description: '管理帮助中心的文档文章',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            localized: true,
            required: true,
            label: '文章标题',
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
            name: 'excerpt',
            type: 'textarea',
            localized: true,
            label: '文章摘要',
            admin: {
                description: '文章的简要描述，用于预览',
            },
        },
        {
            type: 'tabs',
            tabs: [
                {
                    fields: [
                        {
                            name: 'content',
                            type: 'richText',
                            editor: lexicalEditor({
                                features: ({ rootFeatures }) => {
                                    return [
                                        ...rootFeatures,
                                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5'] }),
                                        LinkFeature({
                                            enabledCollections: ['pages', 'posts', 'help-documents'],
                                            fields: ({ defaultFields }) => {
                                                const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
                                                    return !('name' in field && field.name === 'url')
                                                })
                                                return [
                                                    ...defaultFieldsWithoutUrl,
                                                    {
                                                        name: 'url',
                                                        type: 'text',
                                                        admin: {
                                                            condition: ({ linkType }) => linkType !== 'internal',
                                                            description: '输入链接地址。对于锚点链接，请使用 #heading-id 格式',
                                                            placeholder: 'https://example.com 或 #heading-id',
                                                        },
                                                        label: '链接地址',
                                                        required: true,
                                                    },
                                                ]
                                            },
                                        }),
                                        BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                                        FixedToolbarFeature(),
                                        InlineToolbarFeature(),
                                        HorizontalRuleFeature(),
                                    ]
                                },
                            }),
                            label: false,
                            localized: true,
                            required: true,
                        },
                    ],
                    label: 'Content',
                },
                {
                    fields: [
                        {
                            name: 'author',
                            type: 'relationship',
                            relationTo: 'users',
                            label: '作者',
                            admin: {
                                description: '选择文章作者',
                            },
                        },
                        {
                            name: 'category',
                            type: 'relationship',
                            relationTo: 'help-categories',
                            required: true,
                            label: '所属分类',
                            admin: {
                                description: '选择该文档属于哪个分类',
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
                            name: 'relatedArticles',
                            type: 'relationship',
                            relationTo: 'help-documents',
                            hasMany: true,
                            label: '关联文章',
                            admin: {
                                description: '选择与该文章相关的其他文章（多选）',
                            },
                        },
                    ],
                    label: 'Meta',
                },
                {
                    name: 'meta',
                    label: 'SEO',
                    fields: [
                        OverviewField({
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                            imagePath: 'meta.image',
                        }),
                        MetaTitleField({
                            hasGenerateFn: true,
                        }),
                        MetaImageField({
                            relationTo: 'media',
                        }),
                        MetaDescriptionField({}),
                        PreviewField({
                            hasGenerateFn: true,
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                        }),
                    ],
                },
            ],
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