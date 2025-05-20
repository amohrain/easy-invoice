import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/docs",
  "/playground",
  "/demo-video.mp4",
  "/",
  "/view/:id",
  "/terms",
  "/sample.mp4",
  "/privacy-policy",
  "/cookie-policy",
  "/about-us",
  "/contact-us",
  "/refund-policy",
  "/sitemap.xml",
  "/robots.txt",
]);

const isPublicAPIRoute = createRouteMatcher([
  "/api/suggestion",
  "/api/suggestion/:id",
  "/api/templates/:id",
  "/api/invoice/:id",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const isAccessingHome = new URL(req.url).pathname === "/";

  // Redirect logged-in users from public routes (except dashboard)
  if (userId && isPublicRoute(req) && isAccessingHome) {
    return NextResponse.redirect(new URL("/post-auth", req.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!userId && !isPublicRoute(req) && !isPublicAPIRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
