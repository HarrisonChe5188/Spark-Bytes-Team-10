import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check environment variables exist
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return NextResponse.next({ request });
  }

  // Redirect unauthenticated users (except public paths)
  const pathname = request.nextUrl.pathname;
  
  if (
    pathname !== "/" &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/about") &&
    !pathname.startsWith("/sign-up")
  ) {
    // Note: At edge runtime, we can't fully verify auth without importing restricted modules
    // This is a simplified check - full auth validation should happen in route handlers
    const authCookie = request.cookies.get("sb-auth-token");
    
    if (!authCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
