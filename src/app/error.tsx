"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="container flex h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">
                Something went wrong
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
                We're sorry, but an unexpected error occurred. You can try to refresh the page or go back to the homepage.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()}>
                    Try again
                </Button>
                <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                    Return Home
                </Link>
            </div>
        </div>
    );
}
