import type { IAdvancedInfo, SeatPricingMode, SeatTier } from './types'

export const SEAT_TIERS: SeatTier[] = ['lte200', 'lte500', 'lte1000', 'unlimited']

export const SEAT_TIER_CAP: Record<SeatTier, number> = {
  lte200: 200,
  lte500: 500,
  lte1000: 1000,
  unlimited: 999999,
}

export type AdvancedSeatStoragePricing = {
  memberSeatPrice: number
  storageSpacePrice: number
  seatTierPrices: Record<SeatTier, number>
  coldHotStorageFee: number
  chinaHotStoragePrice: number
  chinaColdStoragePrice: number
  overseasHotStoragePrice: number
  overseasColdStoragePrice: number
}

export function getSeatPricingMode(config: IAdvancedInfo): SeatPricingMode {
  return config.seatPricingMode ?? 'bySeat'
}

export function getSeatTier(config: IAdvancedInfo): SeatTier {
  return config.seatTier ?? 'lte200'
}

export function calcMemberSeatsCost(
  config: IAdvancedInfo,
  pricing: Pick<AdvancedSeatStoragePricing, 'memberSeatPrice' | 'seatTierPrices'>,
): number {
  if (getSeatPricingMode(config) === 'byTier') {
    return pricing.seatTierPrices[getSeatTier(config)] ?? 0
  }
  return (config.memberSeats || 0) * pricing.memberSeatPrice
}

/** 私有化授权等需要席位数量时：按档位取档位上限，按席位取实际数量 */
export function getSeatCountForLicense(config: IAdvancedInfo): number {
  if (getSeatPricingMode(config) === 'byTier') {
    return SEAT_TIER_CAP[getSeatTier(config)]
  }
  return config.memberSeats || 0
}

export function calcStorageCost(
  config: IAdvancedInfo,
  pricing: AdvancedSeatStoragePricing,
): number {
  if (config.enableColdHotStorage) {
    let total = pricing.coldHotStorageFee
    total += (config.chinaHotStorage ?? 0) * pricing.chinaHotStoragePrice
    total += (config.chinaColdStorage ?? 0) * pricing.chinaColdStoragePrice
    if (config.enableMultiRegionStorage) {
      total += (config.overseasHotStorage ?? 0) * pricing.overseasHotStoragePrice
      total += (config.overseasColdStorage ?? 0) * pricing.overseasColdStoragePrice
    }
    return total
  }
  if (config.enableMultiRegionStorage) {
    const chinaTb = config.chinaHotStorage ?? config.storageSpace ?? 0
    const overseasTb = config.overseasHotStorage ?? 0
    return (
      chinaTb * pricing.chinaHotStoragePrice + overseasTb * pricing.overseasHotStoragePrice
    )
  }
  return (config.storageSpace || 0) * pricing.storageSpacePrice
}
