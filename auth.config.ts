import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login', // We will build this page later
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === 'ADMIN';
      
      // Protect Admin routes
      if (nextUrl.pathname.startsWith('/admin')) {
        if (isLoggedIn && isAdmin) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
    // Add user ID and Role to the session object
    session({ session, token, user }) {
        if (session.user && token.sub) {
            session.user.id = token.sub;
        }
        // Note: We'll map the role in the main auth.ts for full database access
        return session;
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;