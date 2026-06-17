export type EmptyStateVariant =
  | "not-found"
  | "materials"
  | "search-prompt"
  | "search-empty"
  | "courses-filter"
  | "recent";

export interface EmptyStateContent {
  title: string;
  message: string;
  hint?: string;
}

export function getEmptyStateContent(
  variant: EmptyStateVariant,
  context?: { query?: string }
): EmptyStateContent {
  switch (variant) {
    case "not-found":
      return {
        title: "404 — Lost in the syllabus",
        message:
          "This page filed for bankruptcy and ceased to exist. Even the invisible hand couldn't find this URL.",
        hint: "Head home — the supply of good notes is much higher there.",
      };
    case "materials":
      return {
        title: "Nothing on the shelf yet",
        message:
          "Zero supply, infinite patience. The professor is probably still deciding between Keynes and Hayek before uploading.",
        hint: "Check back soon. Unlike exam dates, quality content is worth the wait.",
      };
    case "search-prompt":
      return {
        title: "We're ready when you are",
        message:
          "We can't read minds (yet). Search for a topic, unit name, or that one thing from class you definitely wrote down somewhere.",
        hint: 'Try "demand", "elasticity", or "syllabus".',
      };
    case "search-empty":
      return {
        title: context?.query ? `No results for "${context.query}"` : "No results found",
        message:
          "Zero hits — unlike inflation, sometimes nothing goes up. Your search might be a bit too ambitious for our humble database.",
        hint: "Try fewer words, drop a filter, or browse by year instead.",
      };
    case "courses-filter":
      return {
        title: "No courses match",
        message:
          "This filter came up empty — like searching for a free lunch in microeconomics. Theoretically interesting, practically unavailable.",
        hint: "Try a different year or category, or view all courses.",
      };
    case "recent":
      return {
        title: "Quiet for now",
        message:
          "No fresh uploads yet. The site isn't on strike — content is just brewing in the back office.",
        hint: "Pick a year below and start reading what's already here.",
      };
  }
}
