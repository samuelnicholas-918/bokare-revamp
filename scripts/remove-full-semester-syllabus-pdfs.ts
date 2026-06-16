import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "official-syllabus-pdf";

async function main() {
  const removed = await prisma.material.deleteMany({
    where: { slug: SLUG },
  });

  console.log(`Removed ${removed.count} full-semester PDF syllabus material(s).`);
  console.log("Economics-only HTML syllabus pages remain on each course.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
