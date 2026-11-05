import { cn } from "@/lib/utils";
function Website({ children, config = {}, className }) {
  const {
    layout = {
      maxWidth: "full",
      padding: "md",
      background: "default",
      minHeight: true,
    },
  } = config;
  const getBackgroundClass = () => {
    switch (layout.background) {
      case "muted":
        return "bg-muted";
      case "gradient":
        return "bg-gradient-to-b from-background to-muted/20";
      default:
        return "bg-background";
    }
  };
  return (
    /* @__PURE__ */ <div
      className={cn(
        layout.minHeight !== false && "min-h-screen",
        getBackgroundClass(),
        "flex flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
}
export { Website as default };
