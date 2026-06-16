"use client";

import { getSessionId } from "@/lib/analytics";

interface TrackDownloadProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackDownloadLink({ href, children, className }: TrackDownloadProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const sessionId = getSessionId();
    const url = `${href}?session=${encodeURIComponent(sessionId)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
