import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "ADMIN",
  },
});

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/upload/:path*", "/admin/analytics/:path*"],
};
