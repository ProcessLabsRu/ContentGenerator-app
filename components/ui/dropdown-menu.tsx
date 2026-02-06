'use client';

import * as React from "react"

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    return <div className="relative inline-block">{children}</div>
}

const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, { ref, ...props })
    }
    return (
        <button ref={ref} {...props}>
            {children}
        </button>
    )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }
>(({ className, align = "start", children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const trigger = ref && 'current' in ref ? ref.current?.previousElementSibling : null
        if (trigger) {
            const handleClick = () => setIsOpen(!isOpen)
            trigger.addEventListener('click', handleClick)
            return () => trigger.removeEventListener('click', handleClick)
        }
    }, [ref, isOpen])

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md ${align === "end" ? "right-0" : "left-0"
                } ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${className || ''}`}
        {...props}
    />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`px-2 py-1.5 text-sm font-semibold ${className || ''}`}
        {...props}
    />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`-mx-1 my-1 h-px bg-gray-200 ${className || ''}`}
        {...props}
    />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
}
