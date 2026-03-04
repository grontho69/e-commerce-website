import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const initialProducts = [
  {
    title: "Elite Panjabi Series 01",
    slug: "elite-panjabi-01",
    price: 3850,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    category: "eid",
    sizes: ["S", "M", "L", "XL", "XXL"],
    tier: "Gold",
    inStock: true,
    description: "Handcrafted intricate embroidery on premium silk-cotton blend. The definitive Eid silhouette.",
    createdAt: new Date(),
  },
  {
    title: "Drop Shoulder Signature Tee",
    slug: "drop-shoulder-sig-01",
    price: 1250,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    tier: "Silver",
    inStock: true,
    description: "Heavyweight 240GSM cotton with a modern boxy fit. Direct-to-garment high-definition print.",
    createdAt: new Date(),
  },
  {
    title: "Minimalist Linen Trousers",
    slug: "min-linen-trouser",
    price: 1850,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    category: "unisex",
    sizes: ["30", "32", "34", "36"],
    tier: "Silver",
    inStock: true,
    description: "Breathable linen-blend trousers with an adjustable elasticated waistband. Summer essential.",
    createdAt: new Date(),
  },
  {
    title: "Lunar Bloom Eid Saree",
    slug: "lunar-bloom-saree",
    price: 5200,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop",
    category: "eid",
    sizes: ["Standard"],
    tier: "Gold",
    inStock: true,
    description: "Premium organza saree with hand-painted floral motifs. Exclusive Eid 2026 Collection.",
    createdAt: new Date(),
  },
  {
    title: "Basic Heavy Hooded Pullover",
    slug: "basic-heavy-hoodie",
    price: 1450,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    tier: "Bronze",
    inStock: true,
    description: "Daily essential fleece hoodie. Durable, warm, and built for comfort.",
    createdAt: new Date(),
  },
  {
    title: "Urban Utility Sweatpants",
    slug: "urban-utility-sweats",
    price: 950,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    tier: "Bronze",
    inStock: true,
    description: "Adjustable cuffs and multi-pocket utility design. Perfect for active lifestyles.",
    createdAt: new Date(),
  },
];

export async function GET() {
  try {
    const db = await getDb();

    // Clear existing
    await db.collection("users").deleteMany({});
    await db.collection("products").deleteMany({});
    await db.collection("orders").deleteMany({});

    // Seed Users
    const userPassword = bcrypt.hashSync("Demo1234!", 10);
    const adminPassword = bcrypt.hashSync("Admin1234!", 10);

    await db.collection("users").insertMany([
      {
        email: "demo@site.com",
        password: userPassword,
        name: "Demo User",
        role: "user",
        createdAt: new Date(),
      },
      {
        email: "admin@site.com",
        password: adminPassword,
        name: "Admin User",
        role: "admin",
        createdAt: new Date(),
      },
    ]);

    // Seed Products
    await db.collection("products").insertMany(initialProducts);

    return NextResponse.json({ message: "Seed successful!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: "Seed failed", error: error.message }, { status: 500 });
  }
}
