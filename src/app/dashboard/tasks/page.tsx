import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/lib/workspace'
import { TasksTable } from '@/components/tasks/task-table'

export default async function TasksPage() {
    const workspace = await getCurrentWorkspace()

    if (!workspace) {
        return <div>No workspace found.</div>
    }

    const supabase = await createClient()

    // Parallel Fetching x4 🚀
    const [tasksResult, customersResult, dealsResult, membersResult] = await Promise.all([
        supabase
            .from('tasks')
            // Join: customer name, deal title, assignee profile name
            .select('*, customers(name), deals(title), profiles(full_name, email)')
            .eq('workspace_id', workspace.id)
            .order('created_at', { ascending: false }),

        supabase
            .from('customers')
            .select('id, name')
            .eq('workspace_id', workspace.id)
            .order('name'),

        supabase
            .from('deals')
            .select('id, title')
            .eq('workspace_id', workspace.id)
            .order('title'),

        supabase
            .from('workspace_members')
            .select('user_id, profiles(full_name)')
            .eq('workspace_id', workspace.id)
    ])

    const tasks = tasksResult.data || []
    const customers = customersResult.data || []
    const deals = dealsResult.data || []
    const members = membersResult.data || []

    if (tasksResult.error) {
        console.error('Error fetching tasks:', tasksResult.error)
    }

    const meta = {
        customers,
        deals,
        members: members as any[]
    }

    return (
        <div className="p-8">
            <Suspense fallback={<div>Loading...</div>}>
                <TasksTable
                    tasks={tasks as any[]}
                    meta={meta}
                    isAdmin={workspace.role === 'admin'}
                    workspaceId={workspace.id}
                />
            </Suspense>
        </div>
    )
}
