import { CourseCategory, MaterialType, PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

interface MaterialSeed {
  type: MaterialType;
  title: string;
  description?: string;
  fileUrl?: string;
  externalUrl?: string;
  fileSizeBytes?: number;
  order: number;
}

interface CourseSeed {
  semester: number;
  title: string;
  slug: string;
  description: string;
  category: CourseCategory;
  learningObjectives: string[];
  materials: MaterialSeed[];
}

const BASE = "https://bokare.in/Com";

const courses: CourseSeed[] = [
  {
    semester: 1,
    title: "Theory of Consumer",
    slug: "sem-1-theory-of-consumer",
    category: "CORE",
    description:
      "First semester Business Economics covering consumer theory, demand analysis, elasticity, and fundamental economic concepts for commerce students.",
    learningObjectives: [
      "Understand basic economic concepts and business economics",
      "Analyze consumer demand and demand functions",
      "Apply elasticity concepts to real-world scenarios",
      "Build foundation for microeconomic analysis",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem1/1_0syllabus.html`, order: 1 },
      { type: "LECTURE_NOTES", title: "Introduction to Economics", externalUrl: `${BASE}/Sem1/1_1economics.html`, order: 2 },
      { type: "LECTURE_NOTES", title: "Introduction to Business Economics", externalUrl: `${BASE}/Sem1/1_2bEco.html`, order: 3 },
      { type: "LECTURE_NOTES", title: "Basic Concepts", externalUrl: `${BASE}/Sem1/1_3basicConcepts.html`, order: 4 },
      { type: "LECTURE_NOTES", title: "Demand Analysis", externalUrl: `${BASE}/Sem1/1_4demandFunction.html`, order: 5 },
      { type: "LECTURE_NOTES", title: "Elasticity of Demand", externalUrl: `${BASE}/Sem1/1_5elasticity.html`, order: 6 },
      { type: "PDF", title: "Semester 1 Complete Notes (PDF)", fileUrl: `${BASE}/Sem1/semOne.pdf`, order: 7 },
    ],
  },
  {
    semester: 2,
    title: "Theory of Production",
    slug: "sem-2-theory-of-production",
    category: "CORE",
    description:
      "Second semester covering production theory, cost analysis, revenue, market structures from perfect competition to oligopoly, and pricing strategies.",
    learningObjectives: [
      "Understand production functions and cost concepts",
      "Analyze firm equilibrium under different market structures",
      "Compare perfect and imperfect competition models",
      "Apply pricing strategies in various market contexts",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem2/2_0syllabus.html`, order: 1 },
      { type: "LECTURE_NOTES", title: "Production Function", externalUrl: `${BASE}/Sem2/2_1production.html`, order: 2 },
      { type: "LECTURE_NOTES", title: "Cost Concepts", externalUrl: `${BASE}/Sem2/2_2cost.html`, order: 3 },
      { type: "LECTURE_NOTES", title: "Revenue Analysis", externalUrl: `${BASE}/Sem2/2_3revenue.html`, order: 4 },
      { type: "LECTURE_NOTES", title: "Pricing Strategies", externalUrl: `${BASE}/Sem2/2_8pricing.html`, order: 5 },
      { type: "PDF", title: "Semester 2 Complete Notes (PDF)", fileUrl: `${BASE}/Sem2/semTwo.pdf`, order: 6 },
    ],
  },
  {
    semester: 3,
    title: "Macroeconomics",
    slug: "sem-3-macroeconomics",
    category: "CORE",
    description:
      "Third semester macroeconomics covering national income, business cycles, circular flow of income, and introductory macroeconomic concepts.",
    learningObjectives: [
      "Understand why macroeconomics matters for business",
      "Measure and interpret national income",
      "Analyze business cycles and economic fluctuations",
      "Trace circular flow of income in an economy",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem3/3_0syllabus.html`, order: 1 },
      { type: "LECTURE_NOTES", title: "Why Macroeconomics?", externalUrl: `${BASE}/Sem3/3_1introduction.html`, order: 2 },
      { type: "LECTURE_NOTES", title: "National Income", externalUrl: `${BASE}/Sem3/3_2nationalIncome.html`, order: 3 },
      { type: "LECTURE_NOTES", title: "Business Cycle", externalUrl: `${BASE}/Sem3/3_3businessCycle.html`, order: 4 },
      { type: "LECTURE_NOTES", title: "Circular Flow of Income", externalUrl: `${BASE}/Sem3/3_4circularFlow.html`, order: 5 },
      { type: "PDF", title: "Semester 3 Complete Notes (PDF)", fileUrl: `${BASE}/Sem3/semTwo.pdf`, order: 6 },
    ],
  },
  {
    semester: 4,
    title: "Banking",
    slug: "sem-4-banking",
    category: "CORE",
    description:
      "Fourth semester covering commercial banking, monetary systems, and financial institutions relevant to commerce students.",
    learningObjectives: [
      "Understand the role of commercial banks in the economy",
      "Analyze banking operations and financial intermediation",
      "Connect banking concepts to broader economic policy",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem4/4_0syllabus.html`, order: 1 },
      { type: "LECTURE_NOTES", title: "Commercial Banking", externalUrl: `${BASE}/Sem4/4_1banking.html`, order: 2 },
      { type: "PDF", title: "Semester 4 Complete Notes (PDF)", fileUrl: `${BASE}/Sem4/semTwo.pdf`, order: 3 },
    ],
  },
  {
    semester: 5,
    title: "Public Finance",
    slug: "sem-5-public-finance",
    category: "CORE",
    description:
      "Fifth semester public finance covering government revenue, expenditure, taxation, and fiscal policy.",
    learningObjectives: [
      "Understand principles of public finance and fiscal policy",
      "Analyze government revenue and expenditure patterns",
      "Evaluate taxation systems and their economic impact",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem5/5_0syllabus.html`, order: 1 },
      { type: "LECTURE_NOTES", title: "Public Finance", externalUrl: `${BASE}/Sem5/5_1publicFinance.html`, order: 2 },
    ],
  },
  {
    semester: 6,
    title: "International Economics",
    slug: "sem-6-international-economics",
    category: "CORE",
    description:
      "Sixth semester international economics covering trade theory, balance of payments, exchange rates, and global economic integration.",
    learningObjectives: [
      "Understand international trade theory and policy",
      "Analyze balance of payments and exchange rate systems",
      "Evaluate globalization's impact on domestic economies",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem6/6_0syllabus.html`, order: 1 },
      { type: "PDF", title: "Semester 6 Complete Notes (PDF)", fileUrl: `${BASE}/Sem6/semTwo.pdf`, order: 2 },
    ],
  },
  {
    semester: 5,
    title: "Managerial Economics (Micro)",
    slug: "sem-5e-managerial-economics-micro",
    category: "ELECTIVE",
    description:
      "Elective course applying microeconomic principles to managerial decision-making including demand analysis, elasticity, and consumer surplus.",
    learningObjectives: [
      "Apply microeconomic tools to business decisions",
      "Analyze demand and elasticity for managerial planning",
      "Use indifference curves and surplus concepts in practice",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem5E/5E_0syllabus.html`, order: 1 },
      { type: "PDF", title: "Elective 5 Complete Notes (PDF)", fileUrl: `${BASE}/Sem5E/semTwo.pdf`, order: 2 },
    ],
  },
  {
    semester: 6,
    title: "Managerial Economics (Macro)",
    slug: "sem-6e-managerial-economics-macro",
    category: "ELECTIVE",
    description:
      "Elective course applying macroeconomic principles to business strategy, covering national income, business cycles, and economic forecasting.",
    learningObjectives: [
      "Apply macroeconomic analysis to business strategy",
      "Interpret economic indicators for decision-making",
      "Understand macroeconomic environment's impact on firms",
    ],
    materials: [
      { type: "LECTURE_NOTES", title: "Business Economics Syllabus", externalUrl: `${BASE}/Sem6E/6E_0syllabus.html`, order: 1 },
      { type: "PDF", title: "Elective 6 Complete Notes (PDF)", fileUrl: `${BASE}/Sem6E/semTwo.pdf`, order: 2 },
    ],
  },
  {
    semester: 0,
    title: "Professional Development",
    slug: "professional-development",
    category: "PROFESSIONAL",
    description:
      "Resources for professional growth, career guidance, and skill development for commerce and economics students.",
    learningObjectives: [
      "Develop professional skills for economics careers",
      "Access career guidance and industry resources",
    ],
    materials: [],
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.download.deleteMany();
  await prisma.material.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  for (const course of courses) {
    const { materials, ...courseData } = course;
    await prisma.course.create({
      data: {
        ...courseData,
        materials: {
          create: materials,
        },
      },
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || "professor@bokare.in",
      passwordHash: await hash(adminPassword, 12),
      name: "Professor Bokare",
      role: "ADMIN",
    },
  });

  console.log(`Seeded ${courses.length} courses`);
  console.log(`Admin: ${process.env.ADMIN_EMAIL || "professor@bokare.in"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
