import { getServerSession } from '@/utilities/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const session = await getServerSession()
        res.status(200).json(session)
    } catch (error) {
        console.error('Session error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
} 