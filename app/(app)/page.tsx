import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CreateProjectModal } from "@/components/create-project-modal"

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user) redirect("/api/auth/signin")

  // Fetch projects created by the user
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { posts: true } }
    }
  })

  return (
    <div className="space-y-8 py-8 px-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground">Manage feedback boards for your different products.</p>
        </div>
        <CreateProjectModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-dashed rounded-lg bg-gray-50/50">
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create your first feedback board to get started.</p>
            <CreateProjectModal />
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>/{project.slug}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">{project._count.posts} posts</span>
                <Link href={`/project/${project.id}`}>
                  <Button variant="outline" size="sm">Open Board &rarr;</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}