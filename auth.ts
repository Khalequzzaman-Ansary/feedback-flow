import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // JWT is easier for scalable apps
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // Fetch role from DB to enforce permissions
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
  ...authConfig,
})