'use client'

import { useState } from 'react'
import { DealForm } from './deal-form'
import { Button } from '@/components/ui/button'
import { deleteDeal } from '@/app/dashboard/deals/actions'

interface Deal {
    id: string
    title: string
    customer_id: string
    stage: string
    value: number
    expected_close_date?: string
    created_at: string
    customers?: { name: string } // Joined data
}

interface Customer {
    id: string
    name: string
}

interface DealsTableProps {
    deals: Deal[]
    customers: Customer[]
    isAdmin: boolean
    workspaceId: string
}

export function DealsTable({ deals, customers, isAdmin, workspaceId }: DealsTableProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this deal?')) return
        await deleteDeal(id)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Deals</h1>
                <Button onClick={() => setIsAddOpen(true)}>Add Deal</Button>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Deal</h2>
                        <DealForm
                            customers={customers}
                            workspaceId={workspaceId}
                            onSuccess={() => setIsAddOpen(false)}
                            onCancel={() => setIsAddOpen(false)}
                        />
                    </div>
                </div>
            )}

            {editingDeal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Deal</h2>
                        <DealForm
                            deal={editingDeal}
                            customers={customers}
                            workspaceId={workspaceId}
                            onSuccess={() => setEditingDeal(null)}
                            onCancel={() => setEditingDeal(null)}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Close Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {deals.map((deal) => (
                            <tr key={deal.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                    {deal.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {deal.customers?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${deal.stage === 'Won' ? 'bg-green-100 text-green-800' :
                                            deal.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                                                deal.stage === 'Negotiation' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-blue-100 text-blue-800'}`}>
                                        {deal.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                                    {formatCurrency(deal.value)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingDeal(deal)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(deal.id)}
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {deals.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No deals found. Create one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
