import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef((props, ref) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" ref={ref} {...props} />
));
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = React.forwardRef((props, ref) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" ref={ref} {...props} />
));
DialogPortal.displayName = "DialogPortal";

const DialogClose = React.forwardRef((props, ref) => (
  <DialogPrimitive.Close data-slot="dialog-close" ref={ref} {...props} />
));
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    ref={ref}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    <DialogPrimitive.Content
      data-slot="dialog-content"
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="dialog-header"
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    ref={ref}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="dialog-footer"
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    ref={ref}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    data-slot="dialog-title"
    className={cn("text-lg leading-none font-semibold", className)}
    ref={ref}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    ref={ref}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
