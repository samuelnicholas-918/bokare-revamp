import { cn } from "@/lib/utils";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";

const TYPE_STYLES: Record<string, string> = {
  LECTURE_NOTES: "bg-teal text-white",
  NUMERICAL_PROBLEMS: "bg-purple text-white",
  QUESTION_BANK: "bg-coral text-white",
  SELF_STUDY: "bg-mint text-charcoal",
  TECHNICAL_NOTES: "bg-gold text-charcoal",
  QUESTION_PAPERS: "bg-electric-blue text-white",
  PDF: "bg-orange-500 text-white",
  RESOURCES: "bg-teal/20 text-teal",
};

export function MaterialTypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium",
        TYPE_STYLES[type] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {MATERIAL_TYPE_LABELS[type] || type}
    </span>
  );
}
