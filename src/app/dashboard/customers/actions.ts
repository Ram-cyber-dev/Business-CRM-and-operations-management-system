'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const customerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    status: z.enum(['Lead', 'Active', 'Closed']).default('Lead'),
})

export async function createCustomer(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Get workspace ID from form (securely passed & RLS validated)
    const workspaceId = formData.get('workspace_id') as string
    if (!workspaceId) return { error: 'Workspace ID missing' }

    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        status: formData.get('status') as 'Lead' | 'Active' | 'Closed',
    }

    const validation = customerSchema.safeParse(data)
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    // Debug log
    console.log('Inserting customer:', { workspace_id: workspaceId, ...data })

    const { error } = await supabase.from('customers').insert({
        workspace_id: workspaceId,
        ...data
    })

    if (error) {
        console.error('Customer Insert Error:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/customers')
    return { success: true }
}

export async function updateCustomer(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        status: formData.get('status') as 'Lead' | 'Active' | 'Closed',
    }

    const { error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/customers')
    return { success: true }
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()

    // Verify Admin Role first?
    // RLS "Admins can delete customers" handles this securely at DB level.
    // But good UX to return specific error if blocked.

    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/customers')
    return { success: true }
}
