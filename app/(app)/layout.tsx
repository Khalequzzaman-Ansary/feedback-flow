import { SidebarNav } from "@/components/sidebar-nav"
import { UserMenu } from "@/components/user-menu"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session?.user) {
        redirect("/api/auth/signin") // Force login for the dashboard area
    }

    return (
        <div className="flex min-h-screen flex-col space-y-6">
            {/* Top Header */}
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between p-4">
                    <Link href={'/'} className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            F
                        </div>
                        FeedbackFlow <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">PRO</span>
                    </Link>
                    <UserMenu user={session.user} />
                </div>
            </header>

            {/* Main Layout: Sidebar + Content */}
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-50 flex-col md:flex">
                    <SidebarNav />
                </aside>
                <main className="flex w-full min-w-0 flex-col">
                    {children}
                </main>
            </div>
        </div>
    )
}