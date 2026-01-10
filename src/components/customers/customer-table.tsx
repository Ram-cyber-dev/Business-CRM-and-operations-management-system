'use client'

import { useState } from 'react'
import { CustomerForm } from './customer-form'
import { Button } from '@/components/ui/button'
import { deleteCustomer } from '@/app/dashboard/customers/actions'

interface Customer {
    id: string
    name: string
    email?: string
    phone?: string
    status: 'Lead' | 'Active' | 'Closed'
    created_at: string
}

interface CustomersTableProps {
    customers: Customer[]
    isAdmin: boolean
    workspaceId: string
}

export function CustomersTable({ customers, isAdmin, workspaceId }: CustomersTableProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer?')) return
        await deleteCustomer(id)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customers</h1>
                <Button onClick={() => setIsAddOpen(true)}>Add Customer</Button>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Customer</h2>
                        <CustomerForm
                            workspaceId={workspaceId}
                            onSuccess={() => setIsAddOpen(false)}
                            onCancel={() => setIsAddOpen(false)}
                        />
                    </div>
                </div>
            )}

            {editingCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
                        <CustomerForm
                            workspaceId={workspaceId}
                            customer={editingCustomer}
                            onSuccess={() => setEditingCustomer(null)}
                            onCancel={() => setEditingCustomer(null)}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-slate-900">{customer.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900">{customer.email}</div>
                                    <div className="text-sm text-slate-500">{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            customer.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    {new Date(customer.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingCustomer(customer)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No customers found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
