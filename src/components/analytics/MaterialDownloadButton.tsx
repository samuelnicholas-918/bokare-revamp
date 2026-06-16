"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackDownloadLink } from "@/components/analytics/TrackDownloadLink";

export function MaterialDownloadButton({ href }: { href: string }) {
  return (
    <Button size="sm" variant="outline" asChild>
      <TrackDownloadLink href={href}>
        <Download className="mr-1 h-4 w-4" />
        PDF
      </TrackDownloadLink>
    </Button>
  );
}
