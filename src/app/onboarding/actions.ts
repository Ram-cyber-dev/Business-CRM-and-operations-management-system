'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const workspaceSchema = z.object({
    name: z.string().min(2),
})

export async function createWorkspace(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string

    const validation = workspaceSchema.safeParse({ name })
    if (!validation.success) {
        return { error: 'Invalid name' }
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Onboarding Debug - User:', user?.id, 'Role:', user?.role, 'Error:', userError)

    if (!user) {
        return { error: 'You must be logged in' }
    }

    // 1. Create Workspace (Using RPC to handle RLS & atomic member addition)
    const { data: workspaceId, error: rpcError } = await supabase.rpc('create_workspace', { name })

    if (rpcError) {
        console.error('Workspace Create RPC Error:', rpcError)
        return { error: rpcError.message }
    }

    // 2. Add Member -> Already handled by the RPC!

    revalidatePath('/', 'layout')

    // Return success or redirect
    redirect('/dashboard')
}
