import { Skeleton } from "../../components/ui/skeleton.jsx";

export function SkeletonCard({ variant = "grid" }) {
  if (variant === "list") {
    return (
      <div className="flex flex-col gap-5 rounded-[24px] border border-white/5 bg-[#0d1d19]/40 p-3 sm:flex-row w-full animate-pulse">
        <Skeleton className="aspect-[16/10] w-full rounded-[18px] sm:w-56 shrink-0 h-36 bg-white/[0.04]" />
        <div className="flex flex-1 flex-col py-2 justify-between min-h-[144px]">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 bg-white/[0.04]" />
            <Skeleton className="h-5 w-2/3 bg-white/[0.04]" />
          </div>
          <Skeleton className="h-4 w-5/6 bg-white/[0.04]" />
          <div className="mt-auto flex items-center justify-between pt-2">
            <Skeleton className="h-3 w-24 bg-white/[0.04]" />
            <Skeleton className="h-5 w-16 bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  // default: "grid" layout matching Course.jsx card
  return (
    <div className="rounded-[26px] border border-white/5 bg-[#0d1d19]/40 overflow-hidden flex flex-col w-full h-full animate-pulse">
      <Skeleton className="aspect-[16/10] w-full rounded-none h-48 bg-white/[0.04]" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-5 w-3/4 bg-white/[0.04]" />
          <Skeleton className="h-8 w-8 rounded-full shrink-0 bg-white/[0.04]" />
        </div>
        <Skeleton className="h-4 w-5/6 bg-white/[0.04]" />
        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full bg-white/[0.04]" />
            <Skeleton className="h-3 w-16 bg-white/[0.04]" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4.5 w-12 bg-white/[0.04]" />
            <Skeleton className="h-2.5 w-14 bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}
