'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import getClientSideURL from '@/utilities/getClientSideURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}
