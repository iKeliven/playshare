import { forwardRef } from "react";
import "./HorizontalRail.css";

const HorizontalRail = forwardRef(function HorizontalRail(
  { children, className = "" },
  ref
) {
  return (
    <div ref={ref} className={`ps-rail ${className}`}>
      {children}
    </div>
  );
});

export default HorizontalRail;