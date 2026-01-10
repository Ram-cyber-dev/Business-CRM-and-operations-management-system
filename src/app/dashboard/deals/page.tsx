import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/lib/workspace'
import { DealsTable } from '@/components/deals/deal-table'

export default async function DealsPage() {
    const workspace = await getCurrentWorkspace()

    if (!workspace) {
        return <div>No workspace found.</div>
    }

    const supabase = await createClient()

    // Parallel Fetching:
    // 1. Deals (with joined Customer name)
    // 2. Customers (for the Add/Edit dropdown)
    const [dealsResult, customersResult] = await Promise.all([
        supabase
            .from('deals')
            .select('*, customers(name)')
            .eq('workspace_id', workspace.id)
            .order('created_at', { ascending: false }),

        supabase
            .from('customers')
            .select('id, name')
            .eq('workspace_id', workspace.id)
            .range(0, 1000) // Limit dropdown size reasonable
            .order('name')
    ])

    const deals = dealsResult.data || []
    const customers = customersResult.data || []

    if (dealsResult.error) {
        console.error('Error fetching deals:', dealsResult.error)
    }

    return (
        <div className="p-8">
            <Suspense fallback={<div>Loading...</div>}>
                <DealsTable
                    deals={deals as any[]}
                    customers={customers}
                    isAdmin={workspace.role === 'admin'}
                    workspaceId={workspace.id}
                />
            </Suspense>
        </div>
    )
}
