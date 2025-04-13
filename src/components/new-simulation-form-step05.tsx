import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewSimulationFormStep05Props {
  className?: string;
}

export function NewSimulationFormStep05({ className }: NewSimulationFormStep05Props) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Step 05</div>
        <h2 className="text-2xl font-bold font-heading">Your simulation is running</h2>
        <div className="grid grid-cols-9 gap-2 sm:grid-cols-17">
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
          <div className="h-10 rounded bg-slate-100 hidden sm:block" />
        </div>
        <Button className="w-full bg-slate-500 hover:bg-slate-600 text-white mt-4">
          Simulation running
        </Button>
      </div>
    </div>
  );
}
