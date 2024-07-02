"use server";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function authCall() {
  let r: any = await auth();
  console.log(r);
  if (r) {
    return {
      code: 0,
      msg: "ok",
      data: r,
    };
  } else {
    return {
      code: 1,
      msg: "unauthorized",
    };
  }
}

export async function signUpCall(params: any) {
  try {
    const userInfo = await prisma.user.create({
      data: {
        username: params.username,
        password: params.password,
      },
    });

    console.log("userInfo", userInfo);

    return {
      code: 0,
      msg: "ok",
      data: userInfo,
    };
  } catch (error) {
    return {
      code: 1,
      msg: "sign up error",
      data: null,
    };
  }
}

export async function loginCall(params: any) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  console.log("user", user);

  if (user) {
    if (user.password === params.password) {
      try {
        await signIn("credentials", {
          username: user.username,
          password: user.password,
          redirect: false,
        });
        return {
          code: 0,
          msg: "ok",
          data: user,
        };
      } catch (error) {
        // @ts-ignore
        console.log(error);
        return {
          code: 1,
          msg: "error",
          data: error,
        };
      }
    } else {
      return {
        code: 2,
        msg: "password error",
        data: null,
      };
    }
  } else {
    return {
      code: 1,
      msg: "user not found",
      data: null,
    };
  }
}
