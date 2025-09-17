import type React from "react";

export const AppPageHeader = ({
  titleSlot,
  children,
}: {
  titleSlot: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="m-2 bg-white border shadow rounded w-full relative">
      <h1 className="font-semibold text-lg px-2 bg-neutral-200">{titleSlot}</h1>
      {children}
    </div>
  );
};
