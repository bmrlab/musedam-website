import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Config } from 'payload'

export const defaultLexical: Config['editor'] = lexicalEditor({
  features: () => {
    return [
      ParagraphFeature(),
      UnderlineFeature(),
      HeadingFeature({
        enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5'],
      }),
      BoldFeature(),
      ItalicFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      EXPERIMENTAL_TableFeature(),
      LinkFeature({
        enabledCollections: ['pages', 'posts'],
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
              },
              label: ({ t }) => t('fields:enterURL'),
              required: true,
            },
          ]
        },
      }),
    ]
  },
})
