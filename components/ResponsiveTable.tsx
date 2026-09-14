import type { ComponentPropsWithoutRef } from "react";

export function ResponsiveTable({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <section
      aria-label="Scrollable table"
      className="max-w-full overflow-x-auto"
    >
      <table className={`min-w-2xl ${className}`} {...props} />
    </section>
  );
}
