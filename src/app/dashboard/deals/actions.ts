'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const dealSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    customer_id: z.string().uuid('Customer is required'),
    stage: z.enum(['New', 'Contacted', 'Negotiation', 'Won', 'Lost']).default('New'),
    value: z.coerce.number().min(0, 'Value must be positive'),
    expected_close_date: z.string().optional().or(z.literal('')),
})

export async function createDeal(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const workspaceId = formData.get('workspace_id') as string
    if (!workspaceId) return { error: 'Workspace ID missing' }

    const data = {
        title: formData.get('title') as string,
        customer_id: formData.get('customer_id') as string,
        stage: formData.get('stage') as any,
        value: formData.get('value'),
        expected_close_date: formData.get('expected_close_date') || null,
    }

    const validation = dealSchema.safeParse(data)
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('deals').insert({
        workspace_id: workspaceId,
        ...validation.data
    })

    if (error) {
        console.error('Deal Insert Error:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/deals')
    return { success: true }
}

export async function updateDeal(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const data = {
        title: formData.get('title') as string,
        customer_id: formData.get('customer_id') as string,
        stage: formData.get('stage') as any,
        value: formData.get('value'),
        expected_close_date: formData.get('expected_close_date') || null,
    }

    const validation = dealSchema.safeParse(data)
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const { error } = await supabase
        .from('deals')
        .update(validation.data) // Safe to use validation.data as it only contains schema fields
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/deals')
    return { success: true }
}

export async function deleteDeal(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/deals')
    return { success: true }
}
