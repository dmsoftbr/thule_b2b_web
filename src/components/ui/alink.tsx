import { cn } from "@/lib/utils";
import React from "react";

export type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const Alink = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => (
  <a
    ref={ref}
    {...props}
    className={cn(
      "focus-visible:border-ring focus-visible:ring-ring/50 rounded focus-visible:ring-[3px] outline-none",
      props.className
    )}
  />
));

Alink.displayName = "Alink";

export default Alink;
