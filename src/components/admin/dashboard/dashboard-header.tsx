export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Platform Overview
        </h2>
        <p className="font-sans text-xs text-muted-foreground sm:text-sm">
          Realtime metrics across events, revenue, orders, and ticket validations.
        </p>
      </div>
    </div>
  );
}
