"use client";

import Script from "next/script";

interface ContentRendererProps {
  html: string;
}

export function ContentRenderer({ html }: ContentRendererProps) {
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
        className="content-prose animate-fade-in"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
