"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject } from "@/app/actions"
import { Plus } from "lucide-react"

export function CreateProjectModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Create a Feedback Board</DialogTitle>
                </DialogHeader>
                <form action={createProject} className="space-y-4">
                    <div className="flex flex-col gap-2.5">
                        <Label htmlFor="name">Project Name</Label>
                        <Input id="name" name="name" placeholder="My SaaS App" required />
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input id="slug" name="slug" placeholder="my-saas-app" required />
                    </div>
                    <Button type="submit" className="w-full">Create Project</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}