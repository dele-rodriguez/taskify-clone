import { clerkMiddleware , createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/api/paystack/webhook"];
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth , req) => {
  const {userId , orgId} = auth();

  if (userId && isPublicRoute(req)) {
    let path = "/select-org";

    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }
  if (!userId && !isPublicRoute) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }
  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};