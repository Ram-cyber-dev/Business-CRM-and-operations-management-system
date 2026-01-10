import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getCurrentWorkspace = cache(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: memberData } = await supabase
        .from('workspace_members')
        .select('role, workspace_id, workspace:workspaces(name)')
        .eq('user_id', user.id)
        .limit(1)
        .single()

    if (!memberData) return null

    return {
        id: memberData.workspace_id,
        name: (memberData.workspace as any)?.name || 'Unknown',
        role: memberData.role
    }
})
