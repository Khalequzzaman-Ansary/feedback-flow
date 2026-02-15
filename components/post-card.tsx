import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { VoteButton } from "./vote-button"

interface PostProps {
    post: {
        id: string
        title: string
        description: string
        category: string
        _count: {
            votes: number
            comments: number
        }
    }
    hasVoted: boolean
}

export function PostCard({ post, hasVoted }: PostProps) {
    return (
        <Card className="flex p-4 gap-4 hover:border-primary/50 transition-colors">
            <div className="shrink-0">
                <VoteButton
                    postId={post.id}
                    initialVotes={post._count.votes}
                    initialHasVoted={hasVoted}
                />
            </div>

            <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <Link href={`/post/${post.id}`} className="font-semibold text-lg hover:underline">
                        {post.title}
                    </Link>
                    <Badge variant="secondary">{post.category}</Badge>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2">
                    {post.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post._count.comments} Comments</span>
                </div>
            </div>
        </Card>
    )
}