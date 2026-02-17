import Link from "next/link"
import { auth } from "@/auth"
import { UserMenu } from "./user-menu"
import { Button } from "./ui/button"

export async function Header() {
    const session = await auth()

    return (
        <header className="border-b bg-white">
            <div className="flex h-16 items-center px-4 max-w-4xl mx-auto justify-between">
                {/* Logo / Home Link */}
                <Link href="/" className="font-bold text-xl tracking-tight">
                    Feedback<span className="text-primary">Flow</span>
                </Link>

                {/* User Actions */}
                <div>
                    {session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}