"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"

export function FeedTabs() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Default to "recent" if no param exists
    const currentTab = searchParams.get("sort") || "recent"

    const handleTabChange = (value: string) => {
        router.push(`/?sort=${value}`)
    }

    return (
        <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                <TabsTrigger value="recent">Newest</TabsTrigger>
                <TabsTrigger value="popular">Most Voted</TabsTrigger>
                <TabsTrigger value="roadmap">In Progress</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}