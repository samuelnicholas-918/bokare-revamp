"use client";

import Script from "next/script";
import { cn } from "@/lib/utils";

interface ContentRendererProps {
  html: string;
}

export function ContentRenderer({ html }: ContentRendererProps) {
  const isSyllabus = html.includes("syllabus-doc");

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        strategy="lazyOnload"
      />
      <Script id="mathjax-config" strategy="lazyOnload">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
            }
          };
        `}
      </Script>
      <article
        className={cn("content-prose animate-fade-in", isSyllabus && "content-syllabus")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
