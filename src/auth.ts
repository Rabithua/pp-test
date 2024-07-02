import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("credentials", credentials);
        let user = null;

        user = await prisma.user.findUnique({
          where: {
            username: credentials?.username as string,
          },
        });

        if (!user) {
          throw new Error("User not found.");
        }

        if (user.password !== credentials?.password) {
          throw new Error("Password not match.");
        }

        console.log("用户信息", user);

        return user as any;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token, user }: any) {
      if (token) {
        session.user = {
          id: token.id,
        };
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
