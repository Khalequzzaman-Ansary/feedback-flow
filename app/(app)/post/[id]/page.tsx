import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { VoteButton } from "@/components/vote-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/app/actions"
import { StatusSelector } from "@/components/status-selector"

// 1. Update the type definition to wrap params in Promise
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    // 2. Await the params to extract the ID
    const { id } = await params

    // 3. Now 'id' is a string, and Prisma will be happy
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            user: true,
            _count: { select: { votes: true } },
            votes: { where: { userId: session?.user?.id } },
            comments: {
                orderBy: { createdAt: "desc" },
                include: { user: true },
            },
        },
    })

    if (!post) notFound()

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <a href="/" className="text-sm text-muted-foreground hover:underline mb-6 block">
                &larr; Back to Feed
            </a>

            <div className="flex gap-4 mb-8">
                <VoteButton
                    postId={post.id}
                    initialVotes={post._count.votes}
                    initialHasVoted={post.votes.length > 0}
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                        <StatusSelector postId={post.id} initialStatus={post.status} />
                    </div>
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{post.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={post.user.image || ""} />
                            <AvatarFallback>{post.user.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <span>{post.user.name}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

            </div>

            <hr className="my-8" />

            <div className="mb-10">
                <h3 className="font-semibold mb-4">Leave a comment</h3>
                <form
                    action={async (formData) => {
                        "use server"
                        await addComment(post.id, formData)
                    }}
                    className="space-y-4"
                >
                    <Textarea name="content" placeholder="What do you think?" required />
                    <Button type="submit">Post Comment</Button>
                </form>
            </div>

            <div className="space-y-6">
                <h3 className="font-semibold text-lg">{post.comments.length} Comments</h3>
                {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 border rounded-lg bg-gray-50/50">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.user.image || ""} />
                            <AvatarFallback>{comment.user.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}