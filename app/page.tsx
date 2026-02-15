import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostCard } from "@/components/post-card"
import { redirect } from "next/navigation"
import { FeedTabs } from "@/components/feed-tabs"
import { Prisma } from "@prisma/client"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }> // Make searchParams a Promise
}) {
  const session = await auth()

  // Await the searchParams
  const params = await searchParams
  const sort = params?.sort || "recent"

  // Protect the route
  if (!session?.user) {
    redirect("/login")
  }

  // 2. Define Sorting Logic
  let orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: "desc" }
  let where: Prisma.PostWhereInput = {}

  if (sort === "popular") {
    orderBy = {
      votes: {
        _count: "desc", // Sort by number of votes
      },
    }
  } else if (sort === "roadmap") {
    where = {
      status: {
        in: ["IN_PROGRESS", "PLANNED", "LIVE"], // Filter by status
      },
    }
  }

  // Fetch posts from Neon DB
  const posts = await prisma.post.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { votes: true, comments: true },
      },
      votes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
    },
  })

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feedback Board</h1>
          <p className="text-muted-foreground">Suggest features and vote on ideas.</p>
        </div>
        <CreatePostModal />
      </div>

      <FeedTabs />

      {/* Feed Section */}
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
            No posts yet. Be the first to create one!
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} hasVoted={post.votes.length > 0} />)
        )}
      </div>
    </main>
  )
}