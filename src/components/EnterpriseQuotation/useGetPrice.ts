export const useGetPrice = () => {
    const isGlobal = process.env.DEPLOY_REGION?.toLowerCase() === 'global'
    const prefix = isGlobal ? '$' : '¥'

    const getPrice = (price: number) => {
        return prefix + price.toLocaleString()
    }
    return getPrice
}