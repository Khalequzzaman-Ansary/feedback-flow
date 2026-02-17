"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateStatus } from "@/app/actions"
/* import { toast } from "sonner" */

// We need to match the Prisma Enum exactly
type Status = "OPEN" | "PLANNED" | "IN_PROGRESS" | "LIVE" | "CLOSED"

export function StatusSelector({ postId, initialStatus }: { postId: string, initialStatus: Status }) {

    async function handleValueChange(value: string) {
        await updateStatus(postId, value as Status)
        // Optional: Add a visual toast here if you installed 'sonner'
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Select defaultValue={initialStatus} onValueChange={handleValueChange}>
                <SelectTrigger className="w-35 h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="LIVE">Live</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}