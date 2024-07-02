import NextAuth from "next-auth";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log("credentials", credentials);
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
});
