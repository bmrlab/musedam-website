'use server'

import { Region } from '@/constant/enum/region'

export const isInChina = async () => {
  return process.env.DEPLOY_REGION?.toLowerCase() === Region.MainLand
}
