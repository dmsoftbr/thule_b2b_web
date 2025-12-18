import { useState } from "react";

// Hook customizado para virtualização
export const useVirtualization = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    itemCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight)
  );

  const offsetY = visibleStart * itemHeight;
  const totalHeight = itemCount * itemHeight;

  return {
    visibleStart,
    visibleEnd,
    offsetY,
    totalHeight,
    setScrollTop,
  };
};
