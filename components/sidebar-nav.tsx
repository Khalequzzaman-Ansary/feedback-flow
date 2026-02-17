"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Map, Rocket, Settings, Users } from "lucide-react"

const items = [
    { title: "Feedback", href: "/", icon: LayoutDashboard },
    { title: "Roadmap", href: "/roadmap", icon: Map }, // We will build this view later
    { title: "Changelog", href: "/changelog", icon: Rocket }, // And this one
    { title: "Settings", href: "/settings", icon: Settings },
]

export function SidebarNav() {
    const pathname = usePathname()

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => (
                <Link key={index} href={item.href}>
                    <span
                        className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                        )}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                    </span>
                </Link>
            ))}
        </nav>
    )
}