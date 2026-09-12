import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@/generated/prisma/client";
import { authenticateUser } from "@/lib/auth/authenticate-user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: authenticateUser,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub && token.role) {
        session.user.id = token.sub;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
