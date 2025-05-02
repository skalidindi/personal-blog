"use client";

import { Share2 } from "lucide-react";

export function ShareButton({
  title,
  text,
  path,
}: {
  title: string;
  text: string;
  path: string;
}) {
  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${path}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.warn("Error sharing content:", error);
      }
    } else {
      console.warn("Web Share API is not supported in this browser.");
    }
  };

  return (
    <Share2
      onClick={handleShare}
      className="cursor-pointer transition-transform transform hover:text-blue-500 active:scale-95 active:text-blue-500"
    />
  );
}
