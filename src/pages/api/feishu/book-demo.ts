import type { NextApiRequest, NextApiResponse } from 'next'
import { saveFormToFeishu } from '@/utilities/feishu'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' })
        return
    }
    try {
        const result = await saveFormToFeishu(req.body)
        res.status(200).json({ success: true, data: result.data })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
} 