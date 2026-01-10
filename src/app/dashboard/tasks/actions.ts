'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    assigned_to: z.string().uuid('Assignee is required'),
    status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
    due_date: z.string().optional().or(z.literal('')),
    // Link fields (one must be set)
    deal_id: z.string().optional().nullable().or(z.literal('')),
    customer_id: z.string().optional().nullable().or(z.literal('')),
}).refine(data => data.deal_id || data.customer_id, {
    message: "Task must be linked to either a Deal or a Customer",
    path: ["deal_id"], // Attach error to one field
})

export async function createTask(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const workspaceId = formData.get('workspace_id') as string
    if (!workspaceId) return { error: 'Workspace ID missing' }

    // Extract raw data
    const rawData = {
        title: formData.get('title') as string,
        assigned_to: formData.get('assigned_to') as string,
        status: formData.get('status') as any,
        due_date: formData.get('due_date') || null,
        deal_id: formData.get('deal_id') || null,
        customer_id: formData.get('customer_id') || null,
    }

    // Handle "none" logic from select inputs if they return empty strings
    if (rawData.deal_id === '') rawData.deal_id = null
    if (rawData.customer_id === '') rawData.customer_id = null

    const validation = taskSchema.safeParse(rawData)
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('tasks').insert({
        workspace_id: workspaceId,
        ...validation.data
    })

    if (error) {
        console.error('Task Insert Error:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/tasks')
    return { success: true }
}

export async function updateTask(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    // Extract raw data
    const rawData = {
        title: formData.get('title') as string,
        assigned_to: formData.get('assigned_to') as string,
        status: formData.get('status') as any,
        due_date: formData.get('due_date') || null,
        deal_id: formData.get('deal_id') || null,
        customer_id: formData.get('customer_id') || null,
    }

    if (rawData.deal_id === '') rawData.deal_id = null
    if (rawData.customer_id === '') rawData.customer_id = null

    const validation = taskSchema.safeParse(rawData)
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const { error } = await supabase
        .from('tasks')
        .update(validation.data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/tasks')
    return { success: true }
}

export async function deleteTask(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/tasks')
    return { success: true }
}
