import type React from "react";

export const AppPageHeader = ({
  titleSlot,
  children,
}: {
  titleSlot: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative overflow-hidden">
      <h1 className="font-semibold text-lg px-3 py-2 bg-neutral-200 border-b border-neutral-300 text-neutral-800">
        {titleSlot}
      </h1>
      {children}
    </div>
  );
};
