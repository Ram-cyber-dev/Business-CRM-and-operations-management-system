'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

// ... imports
export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Parse and validate
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const validation = authSchema.safeParse(data)
    if (!validation.success) {
        return { error: 'Invalid email or password format' }
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    // Check if profile exists, if not create it (Bootstrap Profile)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
        if (!profile) {
            await supabase.from('profiles').insert({
                id: user.id,
                email: user.email!,
                full_name: user.user_metadata?.full_name || '',
            })
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const validation = authSchema.safeParse(data)
    if (!validation.success) {
        return { error: 'Invalid data' }
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Signup error:', error)
        return { error: error.message }
    }

    // Bootstrap Profile immediately
    if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email: authData.user.email!,
        })

        if (profileError) {
            console.error('Profile bootstrap error:', profileError)
            // Don't fail the whole request, but log it. 
            // RLS might block if not logged in? 
            // Actually signUp returns session if auto-confirm is on.
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
