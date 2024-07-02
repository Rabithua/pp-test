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

export async function signUpM(params: any) {
  console.log("signIn", signIn);
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
      } catch (error) {
        // @ts-ignore
        console.log(error);
        return {
          code: 1,
          msg: "登录失败",
        };
      }
    } else {
      return {
        code: 1,
        msg: "密码错误",
      };
    }
  } else {
    const userInfo = await prisma.user.create({
      data: {
        username: params.username,
        password: params.password,
      },
    });

    console.log("userInfo", userInfo);

    try {
      signIn("credentials", {
        username: params.username,
        password: params.password,
        redirect: false,
      });
    } catch (error) {
      return {
        code: 1,
        msg: "登录失败",
      };
    }
  }

  return {
    code: 0,
    msg: "ok",
  };
}
