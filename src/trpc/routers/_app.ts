import { categoryRouter } from "@/modules/categories/server/procedure";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  categories: categoryRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
