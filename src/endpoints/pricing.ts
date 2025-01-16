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
    const response = await fetch(`/musedam-apigw/mini-dam-order/products/universal?type=all`, {
      headers: {
        'x-deploy-region': country,
      },
    })

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
