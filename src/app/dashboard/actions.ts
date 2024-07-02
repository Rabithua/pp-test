"use server";
import { prisma } from "@/lib/prisma";

export async function db_findUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  console.log("user", user);

  return {
    code: 0,
    msg: "ok",
    data: user,
  };
}
