import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <div className="container flex h-[calc(100vh_-_200px)] flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-8xl font-extrabold tracking-tighter">404</h1>
            <h2 className="text-3xl font-bold tracking-tight">
                Page Not Found
            </h2>
            <p className="max-w-md text-lg text-muted-foreground">
                Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
            </p>
            <Link href="/" className={cn(buttonVariants({ variant: "default" }))}>
                Return Home
            </Link>
        </div>
    );
}
