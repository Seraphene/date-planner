import { cn } from "@/lib/utils";

interface SoftCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function SoftCard({ className, children, ...props }: SoftCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-3xl shadow-soft p-6 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
