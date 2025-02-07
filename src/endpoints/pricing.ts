import { MUSE_GLOBAL_SERVER_URL, MUSE_MAINLAND_SERVER_URL } from '@/constant/url'

import { EMuseProductType } from '@/components/Pricing/types/products'

export interface ProductItem {
  discountPrice: number
  id: number
  name: string
  price: number
  productType: EMuseProductType
  recommend: boolean
}

export const getPricingList = async (country: string) => {
  try {
    const response = await fetch(
      `${country === 'global' ? MUSE_GLOBAL_SERVER_URL : MUSE_MAINLAND_SERVER_URL}/mini-dam-order/products/universal?type=all`,
      {
        headers: {
          'x-deploy-region': country,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch pricing data')
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Error fetching pricing data:', error)
    throw error
  }
}
