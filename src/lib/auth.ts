import NextAuth from "next-auth";
import { prisma } from "./prisma";
import credentials from "next-auth/providers/credentials";
import { User } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // trustHost: true,
  providers: [
    credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ) {
        let user = null;

        user = await prisma.user.findUnique({
          where: {
            username: credentials?.username,
          },
        });

        if (!user) {
          throw new Error("User not found.");
        }

        if (user.password !== credentials?.password) {
          throw new Error("Password not match.");
        }
        console.log("用户信息", user);
        return user as any | null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      if (token) {
        session.user = {
          id: token.id,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
