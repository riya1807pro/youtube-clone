import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });
<<<<<<< HEAD

=======
>>>>>>> 9f21a4b (internal structure improvements)
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
<<<<<<< HEAD
    url: process.env.DATABASE_URL || "",
=======
    url: process.env.DATABASE_URL!,
>>>>>>> 9f21a4b (internal structure improvements)
  },
});
