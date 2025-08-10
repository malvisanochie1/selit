import * as React from "react";

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sheet({ open, onOpenChange, children, ...props }: SheetProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative z-50"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

// ...existing code...
export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
}

export function SheetContent({
  className = "",
  side = "left",
  ...props
}: SheetContentProps) {
  // Add a data-side attribute and a class for side
  return (
    <div
      data-side={side}
      className={`bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md ${
        side === "left" ? "left-0" : "right-0"
      } ${className}`}
      {...props}
    />
  );
}

export function SheetHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function SheetTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function SheetDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
      {...props}
    />
  );
}
