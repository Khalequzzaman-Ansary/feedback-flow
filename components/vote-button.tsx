"use client"

import { useOptimistic, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { ArrowBigUp } from "lucide-react"
import { toggleVote } from "@/app/actions"
import { cn } from "@/lib/utils"

interface VoteButtonProps {
    postId: string
    initialVotes: number
    initialHasVoted: boolean
}

export function VoteButton({ postId, initialVotes, initialHasVoted }: VoteButtonProps) {
    const [isPending, startTransition] = useTransition()

    // Optimistic State: [votes, hasVoted]
    const [optimisticState, addOptimisticVote] = useOptimistic(
        { votes: initialVotes, hasVoted: initialHasVoted },
        (state, newVoteState: boolean) => ({
            votes: newVoteState ? state.votes + 1 : state.votes - 1,
            hasVoted: newVoteState,
        })
    )

    return (
        <Button
            variant="outline"
            size="sm"
            className={cn(
                "flex flex-col h-14 w-12 gap-0 p-0 hover:bg-primary/10",
                optimisticState.hasVoted && "border-primary bg-primary/10 text-primary"
            )}
            onClick={() => {
                startTransition(async () => {
                    // 1. Instantly update UI
                    addOptimisticVote(!optimisticState.hasVoted)
                    // 2. Call Server Action
                    await toggleVote(postId)
                })
            }}
            disabled={isPending}
        >
            <ArrowBigUp className={cn("h-6 w-6", optimisticState.hasVoted && "fill-current")} />
            <span className="text-xs font-bold">{optimisticState.votes}</span>
        </Button>
    )
}