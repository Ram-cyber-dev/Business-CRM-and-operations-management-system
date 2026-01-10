import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/lib/workspace'
import { CustomersTable } from '@/components/customers/customer-table'

export default async function CustomersPage() {
    const workspace = await getCurrentWorkspace()

    if (!workspace) {
        return <div>No workspace found.</div>
    }

    const supabase = await createClient()

    // Fetch customers for the current workspace
    // Note: RLS policies using is_workspace_member(workspace_id) will implicitly filter results 
    // IF the policy was "using (is_workspace_member(workspace_id))".
    // However, for efficiency and correctness, we should still filter by workspace_id explicitly in the query,
    // because "select * from customers" would try to scan all rows and then filter by RLS, which is slower.
    // And more importantly, RLS ensures you CAN see them, but explicit filter ensures you ONLY ask for yours.
    // Wait, RLS on SELECT forces the filter anyway. But explicit is better for index usage.

    const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching customers:', error)
        return <div>Failed to load customers</div>
    }

    return (
        <div className="p-8">
            <Suspense fallback={<div>Loading...</div>}>
                <CustomersTable
                    customers={customers as any[]}
                    isAdmin={workspace.role === 'admin'}
                    workspaceId={workspace.id}
                />
            </Suspense>
        </div>
    )
}
