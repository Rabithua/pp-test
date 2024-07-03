"use server";

import { prisma } from "@/lib/prisma";

export async function db_getTopic(id: string) {
  let topic = prisma.topic.findUnique({
    where: {
      id: id,
    },
    select: {
      userId: true,
      id: true,
      title: true,
      content: true,
      tags: true,
      notes: {
        select: {
          order: true,
          id: true,
          title: true,
          content: true,
          tags: true,
        },
      },
    },
  });

  return topic;
}
