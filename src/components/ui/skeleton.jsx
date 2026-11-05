import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }) {
  return (
    /* @__PURE__ */ <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
export { Skeleton };
