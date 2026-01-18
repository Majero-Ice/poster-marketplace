import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ 
  connectionString,
  ssl: connectionString?.includes("supabase.co") ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const posters = [
  {
    title: "Starry Night",
    description: "A beautiful interpretation of Van Gogh's masterpiece. This digital poster captures the essence of the original painting with modern techniques, perfect for art enthusiasts who want to bring classic beauty into their homes.",
    price: 2999,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80",
    fileUrl: "posters/starry-night.jpg",
    category: "Classic Art",
  },
  {
    title: "The Great Gatsby",
    description: "Art deco inspired poster from the classic film. This design features elegant typography and period-appropriate aesthetics that capture the glamour of the Jazz Age.",
    price: 1999,
    imageUrl: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=1200&q=80",
    fileUrl: "posters/gatsby.jpg",
    category: "Film Posters",
  },
  {
    title: "Mountain Vista",
    description: "Stunning landscape photography from the Alps. This high-resolution image captures the majesty of mountain peaks, perfect for nature lovers and outdoor enthusiasts.",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    fileUrl: "posters/mountain.jpg",
    category: "Photography",
  },
  {
    title: "Abstract Waves",
    description: "Modern abstract art with vibrant colors. This contemporary piece features flowing forms and bold color gradients that add energy to any space.",
    price: 1799,
    imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80",
    fileUrl: "posters/abstract.jpg",
    category: "Modern Art",
  },
  {
    title: "Blade Runner",
    description: "Sci-fi noir poster design inspired by the iconic film. Features moody lighting and cyberpunk aesthetics that appeal to fans of science fiction cinema.",
    price: 2199,
    imageUrl: "https://images.unsplash.com/photo-1478720568477-1520d9b164a6?w=1200&q=80",
    fileUrl: "posters/blade-runner.jpg",
    category: "Film Posters",
  },
  {
    title: "Ocean Sunset",
    description: "Peaceful coastal photography capturing the golden hour. This serene image features calm waters and a beautiful sky, perfect for creating a relaxing atmosphere.",
    price: 2299,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    fileUrl: "posters/ocean.jpg",
    category: "Photography",
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.purchase.deleteMany();
  await prisma.poster.deleteMany();
  await prisma.admin.deleteMany();

  await prisma.poster.createMany({
    data: posters,
    skipDuplicates: true,
  });

  console.log(`Created ${posters.length} posters`);

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: {
      email: "admin@postermart.com",
      passwordHash,
    },
  });

  console.log("Created admin user (admin@postermart.com / admin123)");
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
