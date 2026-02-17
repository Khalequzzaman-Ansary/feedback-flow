"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // We need to install this
import { createPost } from "@/app/actions"

export function CreatePostModal({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        await createPost(projectId, formData)
        setOpen(false) // Close modal on success
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Submit Feedback</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Suggest a Feature</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="title">Title</label>
                        <Input id="title" name="title" placeholder="e.g. Dark Mode" required />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                            <option value="Feature">Feature</option>
                            <option value="Bug">Bug</option>
                            <option value="Integration">Integration</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description">Description</label>
                        {/* We will install Textarea next */}
                        <textarea
                            name="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            placeholder="Describe your idea..."
                            required
                        />
                    </div>
                    <Button type="submit">Submit Post</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}