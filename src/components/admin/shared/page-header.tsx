import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 font-sans text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2.5">{children}</div>}
    </div>
  );
}
