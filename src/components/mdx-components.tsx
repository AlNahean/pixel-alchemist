// src/components/mdx-components.tsx
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useMDXComponent } from "next-contentlayer2/hooks"
import { Pre } from "./pre-component"

import { cn } from "@/lib/utils"
import { Callout } from "@/components/callout"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { CodeTabs } from "@/components/code-tabs"
// import { ComponentPreview } from "@/components/component-preview"
// import { ComponentSource } from "@/components/component-source"
import { getIconForLanguageExtension } from "@/components/icons"
import { CopyButton } from "@/components/copy-button"
import { MdxCard } from "@/components/mdx-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CodeBlockWrapper } from "./code-block-wrapper"
import ComponentPreview from './component-preview';
import { ComponentPreviewTemp } from './component-preview-temp';

// NOTE: Some components (like CodeBlockCommand, ComponentPreview, etc.)
// are placeholders here. You would need to have these components implemented in your project.

export const components = {
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn(
        "font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight lg:text-4xl",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      id={
        props.children
          ?.toString()
          .replace(/ /g, "-")
          .replace(/'/g, "")
          .replace(/\?/g, "")
          .toLowerCase() ?? ""
      }
      className={cn(
        "font-heading mt-12 scroll-m-28 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-28 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn(
        "font-heading mt-8 scroll-m-28 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-28 text-lg font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn("leading-relaxed [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.ComponentProps<"hr">) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  //---------------------------------------------
  // Replace your `pre` component with this one FOR DEBUGGING
  // pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => {
  //   console.log("--- MDX <pre> component rendered ---");

  //   // Log the raw children to see what we're getting
  //   console.log("Children received by <pre>:", children);

  //   const child = React.Children.only(children) as React.ReactElement;

  //   // Log the single child we isolated
  //   console.log("Isolated child:", child);

  //   // Log the props of that child to see if __raw__ is there
  //   if (React.isValidElement(child)) {
  //     console.log("Isolated child's props:", child.props);
  //   }

  //   const hasRawProp =
  //     React.isValidElement(child) && typeof child.props?.["__raw__"] === "string";

  //   // Log whether our condition is passing or failing
  //   console.log("Does the child have the '__raw__' prop? ", hasRawProp);

  //   if (hasRawProp) {
  //     const rawCode = child.props["__raw__"];
  //     return (
  //       <div className="relative my-6">
  //         <CopyButton value={rawCode} className="absolute right-4 top-4 z-20" />
  //         <pre
  //           className={cn("min-w-0 overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-50 dark:bg-zinc-950", className)}
  //           {...props}
  //         >
  //           {children}
  //         </pre>
  //       </div>
  //     );
  //   }

  //   // Fallback for regular <pre> tags
  //   return (
  //     <pre
  //       className={cn("my-6 min-w-0 overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-50 dark:bg-zinc-950", className)}
  //       {...props}
  //     >
  //       {children}
  //     </pre>
  //   );
  // },
  // code: ({ className, ...props }) => (
  //   <code
  //     className={cn(
  //       "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
  //       className
  //     )}
  //     {...props}
  //   />
  // ),
  //---------------------------------------------
  // pre: ({
  //   className,
  //   children,
  //   ...props
  // }: React.ComponentProps<"pre">) => {
  //   // rehype-pretty-code will pass the <code> element as a child
  //   const codeElement = React.Children.only(children) as React.ReactElement & {
  //     props: { __raw__?: string; __src__?: string };
  //   };

  //   // The props we added in contentlayer.config.ts are on the <code> element
  //   const rawCode = codeElement.props.__raw__;
  //   const src = codeElement.props.__src__;

  //   return (
  //     // This `div` is the new container for relative positioning
  //     <div className="group relative my-4">
  //       <pre
  //         className={cn(
  //           "mb-4 mt-6 min-w-0 overflow-x-auto rounded-lg bg-zinc-900 py-4 font-mono text-sm text-zinc-50 dark:bg-zinc-950",
  //           className
  //         )}
  //         {...props}
  //       >
  //         {children}
  //       </pre>
  //       {/* The button is positioned relative to the new `div` */}
  //       {rawCode && (
  //         <CopyButton
  //           value={rawCode}
  //           src={src}
  //         // className="absolute right-4 top-4 z-10 opacity-0 transition-opacity group-hover:opacity-100"
  //         />
  //       )}
  //     </div>
  //   );
  // },

  // // 👇 THIS IS THE NEW, SIMPLIFIED `code` COMPONENT
  // // It only handles inline code now.
  // code: ({ className, ...props }: React.ComponentProps<"code">) => (
  //   <code
  //     className={cn(
  //       "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
  //       className
  //     )}
  //     {...props}
  //   />
  // ),
  //--------------------------
  // code: ({ className, ...props }) => (
  //   <code
  //     className={cn(
  //       "relative rounded border px-[0.3rem] py-[0.3rem] font-mono text-sm",
  //       className
  //     )}
  //     {...props}
  //   />
  // ),
  //--------------------------
  pre: Pre,

  // pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => (
  //   <pre
  //     className={cn(
  //       "mb-4 mt-6 min-w-0 overflow-x-auto rounded-lg bg-zinc-900 p-0  font-mono text-sm text-zinc-50 dark:bg-zinc-950",
  //       className
  //     )}
  //     {...props}
  //   >
  //     <>Pre</>
  //     {children}
  //   </pre>
  // ),
  code: ({
    className,
    __raw__,
    __src__,
    __npm__,
    __yarn__,
    __pnpm__,
    __bun__,
    ...props
  }: React.ComponentProps<"code"> & {
    __raw__?: string
    __src__?: string
    __npm__?: string
    __yarn__?: string
    __pnpm__?: string
    __bun__?: string
  }) => {
    // // Handle inline code
    if (typeof props.children === "string" && !props.children.includes("\n")) {
      return (
        <code
          className={cn(
            "relative rounded bg-muted/80 px-[0.3rem] py-[0.2rem] font-mono text-sm",
            className
          )}
          {...props}
        />
      )
    }

    // // Handle npm/yarn/pnpm commands
    // if (__npm__ && __yarn__ && __pnpm__ && __bun__) {
    //   return (
    //     <CodeBlockCommand
    //       __npm__={__npm__}
    //       __yarn__={__yarn__}
    //       __pnpm__={__pnpm__}
    //       __bun__={__bun__}
    //     />
    //   )
    // }

    // Handle full code blocks
    return (
      <div className="relative">
        {/* {__raw__ && <CopyButton value={__raw__} src={__src__} />} */}
        <code
          className={cn("w-full overflow-auto font-mono text-sm", className)}
          {...props}
        />
      </div>
    )
  },
  figure: ({ className, ...props }: React.ComponentProps<"figure">) => (
    <figure className={cn(className)} {...props} />
  ),
  figcaption: ({
    className,
    children,
    ...props
  }: React.ComponentProps<"figcaption">) => {
    const iconExtension =
      "data-language" in props && typeof props["data-language"] === "string"
        ? getIconForLanguageExtension(props["data-language"])
        : null

    return (
      <figcaption
        className={cn(
          "text-muted-foreground mb-2 flex items-center gap-2 text-sm",
          className
        )}
        {...props}
      >
        {iconExtension}
        {children}
      </figcaption>
    )
  },
  // Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
  //   <h3
  //     className={cn(
  //       "step", // <-- CRITICAL: This class must be here
  //       "font-heading mt-8 scroll-m-32 text-xl font-medium tracking-tight",
  //       className
  //     )}
  //     {...props}
  //   />
  // ),
  // Steps: ({ ...props }) => (
  //   <div
  //     className={cn(
  //       "steps not-prose", // <-- CRITICAL: "not-prose" must be here
  //       "mb-12 ml-4 border-l pl-8 [counter-reset:step]"
  //     )}
  //     {...props}
  //   />
  // ),
  Steps: ({ className, ...props }) => (
    <div
      // Apply the container class to reset the counter
      className={cn("steps-container", className)}
      {...props}
    />
  ),

  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        // Apply the item class to increment the counter and show the circle
        "step-item",
        // Your existing heading styles
        "font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Image: (props: React.ComponentProps<typeof Image>) => (
    <Image className={cn("mt-6 rounded-md border")} {...props} />
  ),
  // Tabs: (props: React.ComponentProps<typeof Tabs>) => (
  //   <Tabs className={cn("relative mt-6 w-full")} {...props} />
  // ),
  // TabsList: (props: React.ComponentProps<typeof TabsList>) => (
  //   <TabsList className={cn("w-full justify-start rounded-none border-b bg-transparent p-0")} {...props} />
  // ),
  // TabsTrigger: (props: React.ComponentProps<typeof TabsTrigger>) => (
  //   <TabsTrigger
  //     className={cn(
  //       "relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none",
  //     )}
  //     {...props}
  //   />
  // ),
  // TabsContent: (props: React.ComponentProps<typeof TabsContent>) => (
  //   <TabsContent
  //     className={cn(
  //       "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold",
  //       props.className
  //     )}
  //     {...props}
  //   />
  // ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn('relative mt-6 w-full', className)} {...props} />
  ),
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        'w-full justify-start rounded-none border-b bg-transparent p-0',
        className,
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        'relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
        className,
      )}
      {...props}
    />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold',
        className,
      )}
      {...props}
    />
  ),
  Link: (props: React.ComponentProps<typeof Link>) => (
    <Link className={cn("font-medium underline underline-offset-4")} {...props} />
  ),
  LinkedCard: (props: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
        props.className
      )}
      {...props}
    />
  ),
  Card: MdxCard,
  MdxCard,
  Callout,
  Button,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  CodeBlockWrapper,
  ComponentPreview,
  ComponentPreviewTemp

  // CodeTabs,
  // ComponentPreview,
  // ComponentSource,
  // CodeCollapsibleWrapper,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  let Component;
  try {
    Component = useMDXComponent(code);
  } catch (error) {
    console.error("Failed to compile MDX:", error);
    // This is the fallback UI
    return (
      <div className="mdx">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-900 p-4 dark:bg-red-900/20 dark:border-red-600 dark:text-red-200"
          role="alert"
        >
          <strong className="font-bold">MDX Rendering Error</strong>
          <p>There was an issue compiling this content. Please check the MDX source or the browser console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mdx prose prose-zinc max-w-none dark:prose-invert">
      <Component components={components} />
    </div>
  )
}