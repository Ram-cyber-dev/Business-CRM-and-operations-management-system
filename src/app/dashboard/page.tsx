import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch first workspace found (Bootstrap logic)
    const { data: memberData, error } = await supabase
        .from('workspace_members')
        .select('role, workspace:workspaces(name)')
        .eq('user_id', user.id)
        .limit(1)
        .single()

    if (!memberData || error) {
        // If no workspace found, redirect to onboarding
        redirect('/onboarding')
    }

    // Type assertion or manual check because of the join
    const workspaceName = (memberData.workspace as any)?.name || 'Unknown Workspace'
    const userRole = memberData.role

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Current Workspace
                    </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{workspaceName}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Your Role</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{userRole}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <p>Welcome to your CRM.</p>
        </div>
    )
}
