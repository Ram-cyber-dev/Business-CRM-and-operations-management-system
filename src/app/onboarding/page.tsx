'use client'

import { useActionState } from 'react'
import { createWorkspace } from './actions'

const initialState = {
    error: '',
}

export default function OnboardingPage() {
    const [state, formAction, isPending] = useActionState(createWorkspace, initialState)

    // If user already has a workspace, redirect to dashboard?
    // Ideally yes, but for now let's just show the form.

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create your first workspace
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Give your workspace a name to get started.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" action={formAction}>
                        {state?.error && (
                            <div className="text-red-600 text-sm text-center">{state.error}</div>
                        )}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Workspace Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Acme Corp"
                                    className="block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Create Workspace
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
