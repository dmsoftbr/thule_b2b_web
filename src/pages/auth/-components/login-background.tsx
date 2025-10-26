import { cn } from "@/lib/utils";
import React from "react";

const IMAGES_URL = [
  "assets/images/login_bg1.jpg",
  "assets/images/login_bg2.jpg",
  "assets/images/login_bg3.jpg",
];
interface Props {
  children: React.ReactNode | React.ReactNode[];
}
export const LoginBackground = ({ children }: Props) => {
  const getRandomImage = () => {
    return IMAGES_URL[Math.floor(Math.random() * IMAGES_URL.length)];
  };

  if (typeof window === "undefined") return null;

  return (
    <div
      className={cn(
        "min-h-screen min-w-screen bg-gradient-to-br from-thule-mid-blue-200 to-neutral-100 flex items-center justify-center p-4",
        "bg-cover bg-center"
      )}
      style={{ backgroundImage: `url(${getRandomImage()})` }}
    >
      {children}
    </div>
  );
};
