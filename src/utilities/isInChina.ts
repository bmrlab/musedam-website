import { Region } from '@/constant/enum/region'

export const isInChina = () =>
  process.env.NEXT_PUBLIC_DEPLOY_REGION?.toLowerCase() === Region.MainLand
