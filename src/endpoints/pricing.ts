import { EMuseProductType } from '@/components/Pricing/types/products';
import axios, { AxiosResponse } from 'axios';

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
        const response: AxiosResponse<{ result: ProductItem[] }> = await axios.get(`${process.env.NEXT_PUBLIC_MUSEDAM_SERVER_URL}/mini-dam-order/products/universal`, {
            params: {
                type: 'all'
            },
            headers: {
                'x-deploy-region': country
            }
        });
        return response.data.result;
    } catch (error) {
        console.error('Error fetching your data:', error);
        throw error;
    }
};