"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation Schema
const postSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(1),
  description: z.string().min(10),
})

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string

  // Validate data
  const validatedFields = postSchema.safeParse({ title, category, description })
  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  // Generate a slug from the title (simple version)
  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "") + "-" + Date.now()

  await prisma.post.create({
    data: {
      title,
      description,
      category,
      slug,
      userId: session.user.id!,
    },
  })

  revalidatePath("/") // Refresh the home page to show the new post
  return { success: true }
}

export async function toggleVote(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const userId = session.user.id!

  // Check if vote exists
  const existingVote = await prisma.vote.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  })

  if (existingVote) {
    // Remove vote
    await prisma.vote.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })
  } else {
    // Add vote
    await prisma.vote.create({
      data: {
        postId,
        userId,
      },
    })
  }
  // Revalidate the home page so the count updates for everyone eventually
  revalidatePath("/")
  revalidatePath(`/post/${postId}`)
}

export async function addComment(postId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const content = formData.get("content") as string
  
  if (!content || content.trim().length === 0) {
    return { error: "Comment cannot be empty" }
  }

  await prisma.comment.create({
    data: {
      content,
      postId,
      userId: session.user.id!,
    },
  })

  revalidatePath(`/post/${postId}`) // Refresh the page to show new comment
  return { success: true }
}