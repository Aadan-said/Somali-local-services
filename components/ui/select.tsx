import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange, ...props }: { children: React.ReactNode, value?: string, onValueChange?: (value: string) => void, className?: string }) => {
    const childrenArray = React.Children.toArray(children);
    const trigger: any = childrenArray.find((c: any) => c.type === SelectTrigger);
    const content: any = childrenArray.find((c: any) => c.type === SelectContent);

    // Extract placeholder from SelectValue inside SelectTrigger
    const selectValueChild: any = React.Children.toArray(trigger?.props?.children).find((c: any) => c.type === SelectValue);
    const placeholder = selectValueChild?.props?.placeholder;

    return (
        <div className="relative group">
            <select
                value={value}
                onChange={(e) => onValueChange?.(e.target.value)}
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium text-gray-900",
                    props.className
                )}
                {...props}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {content?.props?.children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400 group-hover:text-purple-600 transition-colors">
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    )
}

const SelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <>{children}</>;
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    return null;
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
}

const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => {
    return <option value={value}>{children}</option>;
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
