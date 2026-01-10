'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings, LogOut, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
    name: string
    href: string
    icon: LucideIcon
}

const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Deals', href: '/dashboard/deals', icon: Briefcase },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-64 bg-slate-900 text-white border-r">
            <div className="p-6">
                <h1 className="text-2xl font-bold">CRM App</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors",
                                isActive && "bg-slate-800 text-blue-400"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive && "text-blue-400")} />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
