'use client'

import { useState } from 'react'
import { TaskForm } from './task-form'
import { Button } from '@/components/ui/button'
import { deleteTask } from '@/app/dashboard/tasks/actions'

interface Task {
    id: string
    title: string
    assigned_to: string
    status: string
    due_date?: string
    created_at: string
    customers?: { name: string } | null
    deals?: { title: string } | null
    profiles?: { full_name: string; email: string } | null // Assignee
}

interface MetaData {
    customers: { id: string; name: string }[]
    deals: { id: string; title: string }[]
    members: { user_id: string; profiles: { full_name: string } }[] // Rough shape
}

interface TasksTableProps {
    tasks: Task[]
    meta: MetaData
    isAdmin: boolean
    workspaceId: string
}

export function TasksTable({ tasks, meta, isAdmin, workspaceId }: TasksTableProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return
        await deleteTask(id)
    }

    // Format link text (Deal OR Customer)
    const getLinkText = (task: Task) => {
        if (task.deals) return `Deal: ${task.deals.title}`
        if (task.customers) return `Customer: ${task.customers.name}`
        return '-'
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <Button onClick={() => setIsAddOpen(true)}>Add Task</Button>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Task</h2>
                        <TaskForm
                            meta={meta}
                            workspaceId={workspaceId}
                            onSuccess={() => setIsAddOpen(false)}
                            onCancel={() => setIsAddOpen(false)}
                        />
                    </div>
                </div>
            )}

            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                        <TaskForm
                            task={editingTask}
                            meta={meta}
                            workspaceId={workspaceId}
                            onSuccess={() => setEditingTask(null)}
                            onCancel={() => setEditingTask(null)}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Linked To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                    {task.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {getLinkText(task)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {task.profiles?.full_name || task.profiles?.email || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingTask(task)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No tasks found. Get organized!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
