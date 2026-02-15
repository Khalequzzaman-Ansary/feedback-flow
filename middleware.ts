import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
 
export default NextAuth(authConfig).auth
 
export const config = {
  // Matcher ignores static files and api routes usually
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};