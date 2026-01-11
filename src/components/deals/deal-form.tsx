'use client'

import { useActionState, useEffect } from 'react'
import { createDeal, updateDeal } from '@/app/dashboard/deals/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Deal {
    id: string
    title: string
    customer_id: string
    stage: string
    value: number
    expected_close_date?: string
}

interface Customer {
    id: string
    name: string
}

interface DealFormProps {
    deal?: Deal
    customers: Customer[]
    workspaceId: string
    onSuccess?: () => void
    onCancel?: () => void
}


type ActionState = {
    error?: string | Record<string, string[]>
    success?: boolean
}

const initialState: ActionState = {
    error: '',
    success: false
}

export function DealForm({ deal, customers, workspaceId, onSuccess, onCancel }: DealFormProps) {
    const action = deal ? updateDeal : createDeal
    const [state, formAction, isPending] = useActionState(action, initialState)

    useEffect(() => {
        if (state.success) {
            if (onSuccess) onSuccess()
        }
    }, [state, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {deal && <input type="hidden" name="id" value={deal.id} />}
            <input type="hidden" name="workspace_id" value={workspaceId} />

            {state.error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {typeof state.error === 'string' ? state.error : JSON.stringify(state.error)}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Deal Title</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={deal?.title}
                    required
                    placeholder="Big Contract"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="customer_id">Customer</Label>
                <select
                    id="customer_id"
                    name="customer_id"
                    defaultValue={deal?.customer_id}
                    required
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                >
                    <option value="">Select a customer...</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="value">Value ($)</Label>
                    <Input
                        id="value"
                        name="value"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={deal?.value}
                        required
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expected_close_date">Close Date</Label>
                    <Input
                        id="expected_close_date"
                        name="expected_close_date"
                        type="date"
                        defaultValue={deal?.expected_close_date ? new Date(deal.expected_close_date).toISOString().split('T')[0] : ''}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <select
                    id="stage"
                    name="stage"
                    defaultValue={deal?.stage || 'New'}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" onClick={onCancel} className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-100">
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : (deal ? 'Update Deal' : 'Add Deal')}
                </Button>
            </div>
        </form>
    )
}
