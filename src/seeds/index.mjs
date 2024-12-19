import config from '@payload-config'
import { getPayload } from 'payload'

const createSeedForm = async () => {
  try {
    const payload = await getPayload({ config })

    const existingForms = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Subscribe Form',
        },
      },
    })

    if (existingForms.totalDocs === 0) {
      await payload.create({
        collection: 'forms',
        data: {
          title: 'Subscribe Form',
          fields: [
            {
              name: 'email',
              label: 'Email',
              required: true,
              blockType: 'email',
            },
          ],
          confirmationType: 'message',
          confirmationMessage: {
            root: {
              type: 'root',
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  children: [{ type: 'text', version: 1, text: '感谢您的订阅！' }],
                },
              ],
            },
          },
        },
      })

      console.log('Seed: Created Subscribe Form')
    }
  } catch (error) {
    console.error('Error seeding forms:', error)
  }
}

createSeedForm()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
