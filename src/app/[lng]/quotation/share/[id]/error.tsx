'use client'

import { useEffect } from 'react'
import { QuotationError } from '@/components/EnterpriseQuotation/Error'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Quotation share page error:', error)
    }, [error])

    return <QuotationError errorMsg={error.message} />
} 