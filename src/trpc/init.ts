import { db } from "@/db";
import { users } from "@/db/schema";
import { ratelimit } from "@/lib/ratelimit";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { clerkUserId: { userId } };
});
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
// export const baseProcedure = createTRPCRouter().procedure.input(z.object({}));
export const baseProcedure = t.procedure; // Or other shared logic
export const ProtectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const userId = ctx.clerkUserId?.userId;

  if (userId) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerk_Id, userId)) // Proceed only if userId is valid
      .limit(1);

    // if (!user) {
    //   throw new TRPCError({ code: "UNAUTHORIZED" });
    // }
    console.log("User ID is valid.", user);

    const { success } = await ratelimit.limit(userId);

    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }
  } else {
    // Handle case where userId is null or undefined
    console.log("User ID is null or undefined.");
  }

  return opts.next({
    ctx: {
      ...ctx,
      userId,
    },
  });
});
