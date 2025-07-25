import Link from "next/link"
import { cn } from "@/lib/utils"
import React from "react"

interface MdxCardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string
  disabled?: boolean
  // We keep these for cases where we don't pass children
  title?: string
  description?: string
  children?: React.ReactNode
}

export function MdxCard({
  href,
  className,
  children,
  disabled,
  title,
  description,
  ...props
}: MdxCardProps) {
  // This is the component that will render the content.
  // By using a div, we create a safe container that can accept any children,
  // including the <p> tags automatically generated by MDX.
  const ContentWrapper = (
    <div
      className={cn(
        "group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-between space-y-4">
        {/*
          THIS IS THE KEY CHANGE.
          This div acts as the content area. The className is designed to
          style paragraphs that are direct children (`[&>p]`), which is
          exactly what MDX produces. This avoids the p-in-p nesting error.
        */}
        <div className="space-y-2 [&>h3]:!mt-0 [&>h4]:!mt-0 [&>p]:text-muted-foreground">
          {/*
            Render children directly if they exist. This is the primary use case for MDX.
            The MDX engine will provide <p>Some text</p> as the children, and it will be
            rendered safely inside this div.
          */}
          {children}

          {/*
            As a fallback, if no children are provided, we can use the title and description props.
            This makes the card component versatile.
          */}
          {!children && title && <h3 className="font-semibold">{title}</h3>}
          {!children && description && <p>{description}</p>}
        </div>
      </div>
    </div>
  )

  // If an href is provided, wrap the entire card in a link.
  // Otherwise, just return the card itself.
  return href && !disabled ? (
    <Link href={href} className="absolute inset-0">
      {ContentWrapper}
      <span className="sr-only">View</span>
    </Link>
  ) : (
    ContentWrapper
  )
}