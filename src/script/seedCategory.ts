import { db } from "@/db";
import { categories } from "@/db/schema";

export const CategoryNames = [
  "Electronics",
  "Books",
  "Clothing",
  "Shoes",
  "Home & Kitchen",
  "Sports",
  "Beauty & Personal Care",
  "Health & Household",
  "Toys & Games",
  "Automotive",
  "Tools & Home Improvement",
];

async function main() {
  console.log("Seeding categories.....");

  try {
    // Optionally, clear the existing categories first (not recommended for production)
    await db.delete(categories).execute();

    const values = CategoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));
    await db.insert(categories).values(values);

    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error while seeding categories", error);
    process.exit(1);
  }
}

main();
