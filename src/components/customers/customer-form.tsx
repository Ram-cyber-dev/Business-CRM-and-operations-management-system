'use client'

import { useActionState, useEffect, useState } from 'react'
import { createCustomer, updateCustomer } from '@/app/dashboard/customers/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Customer {
    id: string
    name: string
    email?: string
    phone?: string
    status: 'Lead' | 'Active' | 'Closed'
}

interface CustomerFormProps {
    customer?: Customer
    workspaceId: string
    onSuccess?: () => void
    onCancel?: () => void
}

const initialState = {
    error: '',
    success: false
}

export function CustomerForm({ customer, workspaceId, onSuccess, onCancel }: CustomerFormProps) {
    const action = customer ? updateCustomer : createCustomer
    const [state, formAction, isPending] = useActionState(action, initialState)

    useEffect(() => {
        if ((state as any)?.success) {
            if (onSuccess) onSuccess()
        }
    }, [state, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {customer && <input type="hidden" name="id" value={customer.id} />}
            <input type="hidden" name="workspace_id" value={workspaceId} />

            {(state as any)?.error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {typeof (state as any).error === 'string' ? (state as any).error : JSON.stringify((state as any).error)}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={customer?.name}
                    required
                    placeholder="Acme Corp"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={customer?.email}
                        placeholder="contact@acme.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={customer?.phone}
                        placeholder="+1 555-0123"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    name="status"
                    defaultValue={customer?.status || 'Lead'}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                >
                    <option value="Lead">Lead</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" onClick={onCancel} className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-100">
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : (customer ? 'Update Customer' : 'Add Customer')}
                </Button>
            </div>
        </form>
    )
}
