import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. Spread authConfig FIRST so defaults are loaded
  ...authConfig,

  // 2. Define Providers
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  // 3. Define Callbacks LAST (to override authConfig where needed)
  callbacks: {
    // Preserve the 'authorized' check from authConfig
    ...authConfig.callbacks,

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // Fetch role from DB
      if (session.user) {
        const user = await prisma.user.findUnique({ where: { id: token.sub } });
        session.user.role = user?.role || "USER";
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  },
})