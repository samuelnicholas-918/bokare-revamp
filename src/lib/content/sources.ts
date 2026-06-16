/**
 * Maps original bokare.in HTML files to course slugs and material metadata.
 */
export const CONTENT_SOURCES = [
  { file: "1_0syllabus.html", sem: "Sem1", courseSlug: "sem-1-theory-of-consumer", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "1_1economics.html", sem: "Sem1", courseSlug: "sem-1-theory-of-consumer", title: "Introduction to Economics", slug: "introduction-to-economics", type: "LECTURE_NOTES" as const },
  { file: "1_2bEco.html", sem: "Sem1", courseSlug: "sem-1-theory-of-consumer", title: "Introduction to Business Economics", slug: "introduction-to-business-economics", type: "LECTURE_NOTES" as const },
  { file: "1_3basicConcepts.html", sem: "Sem1", courseSlug: "sem-1-theory-of-consumer", title: "Basic Concepts", slug: "basic-concepts", type: "LECTURE_NOTES" as const },
  { file: "1_4demandFunction.html", sem: "Sem1", courseSlug: "sem-1-theory-of-consumer", title: "Demand Analysis", slug: "demand-analysis", type: "LECTURE_NOTES" as const },
  { file: "1_5elasticity.html", sem: "Sem1", courseSlug: "sem-1-theory-of-consumer", title: "Elasticity of Demand", slug: "elasticity-of-demand", type: "LECTURE_NOTES" as const },
  { file: "2_0syllabus.html", sem: "Sem2", courseSlug: "sem-2-theory-of-production", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "2_1production.html", sem: "Sem2", courseSlug: "sem-2-theory-of-production", title: "Production Function", slug: "production-function", type: "LECTURE_NOTES" as const },
  { file: "2_2cost.html", sem: "Sem2", courseSlug: "sem-2-theory-of-production", title: "Cost Concepts", slug: "cost-concepts", type: "LECTURE_NOTES" as const },
  { file: "2_3revenue.html", sem: "Sem2", courseSlug: "sem-2-theory-of-production", title: "Revenue Analysis", slug: "revenue-analysis", type: "LECTURE_NOTES" as const },
  { file: "2_8pricing.html", sem: "Sem2", courseSlug: "sem-2-theory-of-production", title: "Pricing Strategies", slug: "pricing-strategies", type: "LECTURE_NOTES" as const },
  { file: "3_0syllabus.html", sem: "Sem3", courseSlug: "sem-3-macroeconomics", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "3_1introduction.html", sem: "Sem3", courseSlug: "sem-3-macroeconomics", title: "Why Macroeconomics?", slug: "why-macroeconomics", type: "LECTURE_NOTES" as const },
  { file: "3_2nationalIncome.html", sem: "Sem3", courseSlug: "sem-3-macroeconomics", title: "National Income", slug: "national-income", type: "LECTURE_NOTES" as const },
  { file: "3_3businessCycle.html", sem: "Sem3", courseSlug: "sem-3-macroeconomics", title: "Business Cycle", slug: "business-cycle", type: "LECTURE_NOTES" as const },
  { file: "3_4circularFlow.html", sem: "Sem3", courseSlug: "sem-3-macroeconomics", title: "Circular Flow of Income", slug: "circular-flow-of-income", type: "LECTURE_NOTES" as const },
  { file: "4_0syllabus.html", sem: "Sem4", courseSlug: "sem-4-banking", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "4_1banking.html", sem: "Sem4", courseSlug: "sem-4-banking", title: "Commercial Banking", slug: "commercial-banking", type: "LECTURE_NOTES" as const },
  { file: "5_0syllabus.html", sem: "Sem5", courseSlug: "sem-5-public-finance", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "5_1publicFinance.html", sem: "Sem5", courseSlug: "sem-5-public-finance", title: "Public Finance", slug: "public-finance", type: "LECTURE_NOTES" as const },
  { file: "6_0syllabus.html", sem: "Sem6", courseSlug: "sem-6-international-economics", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "5E_0syllabus.html", sem: "Sem5E", courseSlug: "sem-5e-managerial-economics-micro", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
  { file: "6E_0syllabus.html", sem: "Sem6E", courseSlug: "sem-6e-managerial-economics-macro", title: "Business Economics Syllabus", slug: "syllabus", type: "LECTURE_NOTES" as const },
] as const;

export const BASE_URL = "https://bokare.in/Com";
