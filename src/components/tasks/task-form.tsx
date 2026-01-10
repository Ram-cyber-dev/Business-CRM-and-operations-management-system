'use client'

import { useActionState, useEffect, useState } from 'react'
import { createTask, updateTask } from '@/app/dashboard/tasks/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Types (simplified for Form usage)
interface MetaData {
    customers: { id: string; name: string }[]
    deals: { id: string; title: string }[]
    members: { user_id: string; profiles: { full_name: string; email?: string } }[]
}

interface TaskFormProps {
    task?: any // Loose type for simplicity in form
    meta: MetaData
    workspaceId: string
    onSuccess?: () => void
    onCancel?: () => void
}

const initialState = {
    error: '',
    success: false
}

export function TaskForm({ task, meta, workspaceId, onSuccess, onCancel }: TaskFormProps) {
    const action = task ? updateTask : createTask
    const [state, formAction, isPending] = useActionState(action, initialState)

    // State to manage conditional logic (Deal vs Customer)
    // If task exists, prefill. 
    // If user selects Deal, auto-clear Customer, and vice versa.
    const [linkType, setLinkType] = useState<'deal' | 'customer'>(
        task?.deals ? 'deal' : task?.customers ? 'customer' : 'deal' // Default
    )

    useEffect(() => {
        if ((state as any)?.success) {
            if (onSuccess) onSuccess()
        }
    }, [state, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {task && <input type="hidden" name="id" value={task.id} />}
            <input type="hidden" name="workspace_id" value={workspaceId} />

            {(state as any)?.error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {typeof (state as any).error === 'string' ? (state as any).error : JSON.stringify((state as any).error)}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={task?.title}
                    required
                    placeholder="Follow up email"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="assigned_to">Assign As</Label>
                <select
                    id="assigned_to"
                    name="assigned_to"
                    defaultValue={task?.assigned_to}
                    required
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                >
                    <option value="">Select a member...</option>
                    {meta.members.map(m => (
                        <option key={m.user_id} value={m.user_id}>
                            {m.profiles?.full_name || m.profiles?.email || 'Unnamed Member'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Link Logic */}
            <div className="space-y-2">
                <Label>Link To</Label>
                <div className="flex space-x-4 mb-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="link_type"
                            checked={linkType === 'deal'}
                            onChange={() => setLinkType('deal')}
                        />
                        <span>Deal</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="link_type"
                            checked={linkType === 'customer'}
                            onChange={() => setLinkType('customer')}
                        />
                        <span>Customer</span>
                    </label>
                </div>

                {linkType === 'deal' ? (
                    <select
                        name="deal_id"
                        defaultValue={task?.deal_id || ''}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Select a deal...</option>
                        {meta.deals.map(d => (
                            <option key={d.id} value={d.id}>{d.title}</option>
                        ))}
                    </select>
                ) : (
                    <select
                        name="customer_id"
                        defaultValue={task?.customer_id || ''}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Select a customer...</option>
                        {meta.customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                )}
                {/* Hidden inputs to clear the other field when submitting */}
                {linkType === 'deal' && <input type="hidden" name="customer_id" value="" />}
                {linkType === 'customer' && <input type="hidden" name="deal_id" value="" />}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    name="status"
                    defaultValue={task?.status || 'Pending'}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    defaultValue={task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" onClick={onCancel} className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-100">
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : (task ? 'Update Task' : 'Add Task')}
                </Button>
            </div>
        </form>
    )
}
