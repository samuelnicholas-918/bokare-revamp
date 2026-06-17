"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
    };
  }
}

interface ContentRendererProps {
  html: string;
}

export function ContentRenderer({ html }: ContentRendererProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [mathReady, setMathReady] = useState(false);
  const isSyllabus = html.includes("syllabus-doc");

  useEffect(() => {
    if (!mathReady || !articleRef.current) return;

    window.MathJax?.typesetPromise?.([articleRef.current]).catch(() => {
      /* MathJax may not be loaded yet */
    });
  }, [html, mathReady]);

  return (
    <>
      <Script id="mathjax-config" strategy="afterInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
            },
            options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }
          };
        `}
      </Script>
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        strategy="afterInteractive"
        onLoad={() => setMathReady(true)}
      />
      <article
        ref={articleRef}
        className={cn(
          "content-prose animate-fade-in",
          isSyllabus && "content-syllabus",
          !isSyllabus && html.includes("study-doc") && "content-study"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
