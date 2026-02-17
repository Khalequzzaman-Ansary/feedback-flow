import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostCard } from "@/components/post-card"
import { FeedTabs } from "@/components/feed-tabs"
import { Prisma } from "@prisma/client"
import { notFound } from "next/navigation"

export default async function ProjectPage({
    params,
    searchParams,
}: {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ sort?: string }>
}) {
    const session = await auth()
    const { projectId } = await params // Get projectId from URL
    const { sort } = (await searchParams) || { sort: "recent" }

    // 1. Verify Project Exists
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    })

    if (!project) notFound()

    // 2. Fetch Posts for THIS Project only
    let orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: "desc" }
    let where: Prisma.PostWhereInput = { projectId } // Filter by Project ID

    if (sort === "popular") {
        orderBy = { votes: { _count: "desc" } }
    } else if (sort === "roadmap") {
        where = { ...where, status: { in: ["IN_PROGRESS", "PLANNED", "LIVE"] } }
    }

    const posts = await prisma.post.findMany({
        where,
        orderBy,
        include: {
            _count: { select: { votes: true, comments: true } },
            votes: { where: { userId: session?.user?.id }, select: { userId: true } },
        },
    })

    return (
        <div className="w-full max-w-4xl py-10 px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="min-w-0">
                    <h1 className="text-3xl font-bold wrap-break-word">{project.name}</h1>
                    <p className="text-muted-foreground">Feedback Board</p>
                </div>
                <div className="shrink-0">
                    <CreatePostModal projectId={project.id} />
                </div>
            </div>

            <FeedTabs />

            <div className="grid gap-4">
                {posts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
                        No posts yet in this project.
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} hasVoted={post.votes.length > 0} />
                    ))
                )}
            </div>
        </div>
    )
}