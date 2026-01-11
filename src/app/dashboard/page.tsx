import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentWorkspace } from '@/lib/workspace'
import { Users, Briefcase, CheckSquare, AlertCircle } from 'lucide-react'

// Metrics Component
async function DashboardMetrics({ workspaceId }: { workspaceId: string }) {
    const supabase = await createClient()

    // Parallel data fetching for metrics
    const [
        { count: customersCount },
        { count: dealsCount },
        { count: tasksCount },
        { count: overdueCount },
        dealsResult,
        tasksResult
    ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('deals').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId).lt('due_date', new Date().toISOString()).neq('status', 'Completed'),
        supabase.from('deals').select('stage').eq('workspace_id', workspaceId),
        supabase.from('tasks').select('status').eq('workspace_id', workspaceId)
    ])

    // Aggregation for breakdowns
    const dealsByStage = (dealsResult.data || []).reduce((acc: any, curr) => {
        acc[curr.stage] = (acc[curr.stage] || 0) + 1
        return acc
    }, {})

    const tasksByStatus = (tasksResult.data || []).reduce((acc: any, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1
        return acc
    }, {})

    return (
        <div className="space-y-8">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/dashboard/customers" className="block group">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 group-hover:border-blue-300 group-hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Customers</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{customersCount || 0}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/deals" className="block group">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 group-hover:border-green-300 group-hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Deals</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{dealsCount || 0}</h3>
                            </div>
                            <div className="p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
                                <Briefcase className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/tasks" className="block group">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 group-hover:border-purple-300 group-hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Tasks</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{tasksCount || 0}</h3>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors">
                                <CheckSquare className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/tasks" className="block group">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 group-hover:border-red-300 group-hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Overdue Tasks</p>
                                <h3 className="text-2xl font-bold text-red-600 mt-1">{overdueCount || 0}</h3>
                            </div>
                            <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deals by Stage */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-900">Deals by Stage</h3>
                    </div>
                    <div className="p-6">
                        {Object.keys(dealsByStage).length === 0 ? (
                            <p className="text-sm text-slate-500">No deals yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {['New', 'Contacted', 'Negotiation', 'Won', 'Lost'].map(stage => {
                                    const count = dealsByStage[stage] || 0
                                    if (count === 0) return null
                                    return (
                                        <div key={stage} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-700">{stage}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${(count / (dealsCount || 1)) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 w-6 text-right">{count}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tasks by Status */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-semibold text-slate-900">Tasks by Status</h3>
                    </div>
                    <div className="p-6">
                        {Object.keys(tasksByStatus).length === 0 ? (
                            <p className="text-sm text-slate-500">No tasks yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {['Pending', 'In Progress', 'Completed'].map(status => {
                                    const count = tasksByStatus[status] || 0
                                    if (count === 0) return null
                                    return (
                                        <div key={status} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-700">{status}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${status === 'Completed' ? 'bg-green-500' :
                                                            status === 'In Progress' ? 'bg-yellow-500' : 'bg-slate-400'
                                                            }`}
                                                        style={{ width: `${(count / (tasksCount || 1)) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 w-6 text-right">{count}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default async function DashboardPage() {
    const workspace = await getCurrentWorkspace()

    if (!workspace) {
        redirect('/onboarding')
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome to {workspace.name}</p>
            </div>

            <Suspense fallback={<div>Loading metrics...</div>}>
                <DashboardMetrics workspaceId={workspace.id} />
            </Suspense>
        </div>
    )
}
