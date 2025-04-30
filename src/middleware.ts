<<<<<<< HEAD
// import { Protect } from "@clerk/nextjs";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// export default clerkMiddleware();

const IsProtectedRoute = createRouteMatcher(["/studio(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (IsProtectedRoute(req)) await auth.protect();
=======
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/studio(.*)",
  "/subscriptions",
  "/feed/subscribed",
  "/playlists(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
>>>>>>> 9f21a4b (internal structure improvements)
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
<<<<<<< HEAD
    "/(api|trpc)(.*)?",
=======
    "/(api|trpc)(.*)",
>>>>>>> 9f21a4b (internal structure improvements)
  ],
};
