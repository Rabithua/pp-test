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

        return {
          id: user.id,
        } as any;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, account, user }: any) {
      console.log("jwt", token, account, user);
      if (user) {
        return { ...token, id: user.id }; // Save id to token as docs says: https://next-auth.js.org/configuration/callbacks
      }
      return token;
    },
    session: ({ session, token, user }: any) => {
      console.log("session", session, token, user);
      return {
        ...session,
        user: {
          ...session.user,
          // id: user.id, // This is copied from official docs which find user is undefined
          id: token.id, // Get id from token instead
        },
      };
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
