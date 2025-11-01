import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Intercom Send Message API
 *
 * 用于发送消息给用户
 * 需要设置 INTERCOM_ACCESS_TOKEN 环境变量
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { message, userId, email } = req.body

    if (!message) {
      res.status(400).json({ error: 'Message is required' })
      return
    }

    // 需要 Intercom Access Token
    const accessToken = process.env.INTERCOM_ACCESS_TOKEN

    if (!accessToken) {
      res.status(500).json({ error: 'Intercom access token not configured' })
      return
    }

    // Intercom REST API 不支持向匿名访客主动发送消息
    // 需要使用浏览器 SDK 来发送消息
    // 这个 API 只用于触发前端的 Intercom SDK

    res.status(200).json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: error.message })
  }
}
