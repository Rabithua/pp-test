"use server";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TopicWithNotes } from "@/lib/type";

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

export async function signOutCall() {
  await signOut();
  return;
}

export async function db_CreatTopic(topic: TopicWithNotes, userId: string) {
  const newTopic = await prisma.topic.create({
    data: {
      title: topic.title,
      content: topic.content,
      tags: topic.tags,
      userId: userId,
      notes: {
        create: topic.notes,
      },
    },
    select: {
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

  console.log("newTopic", newTopic);

  return {
    code: 0,
    msg: "ok",
    data: newTopic,
  };
}

export async function db_GetAllTopics(userId: string) {
  const topics = await prisma.topic.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tags: true,
      notes: {
        select: {
          topicId: true,
          order: true,
          id: true,
          title: true,
          content: true,
          tags: true,
        },
      },
    },
  });

  console.log("topics", topics);

  return {
    code: 0,
    msg: "ok",
    data: topics,
  };
}

export async function db_UpdateTopic(topic: TopicWithNotes) {
  const updatedTopic = await prisma.topic.update({
    where: {
      id: topic.id,
    },
    data: {
      title: topic.title,
      content: topic.content,
      tags: topic.tags,
      notes: {
        updateMany: topic.notes
          .filter((note) => note.id)
          .map((note) => {
            return {
              where: {
                id: note.id,
              },
              data: {
                ...note,
                topicId: undefined,
              },
            };
          }),
        createMany: {
          data: topic.notes.filter((note) => !note.id),
        },
      },
    },
    select: {
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

  console.log("updatedTopic", updatedTopic);

  return {
    code: 0,
    msg: "ok",
    data: updatedTopic,
  };
}

export async function db_DeleteTopic(topicId: string) {
  const deletedNotes = await prisma.note.deleteMany({
    where: {
      topicId: topicId,
    },
  });

  const deletedTopic = await prisma.topic.delete({
    where: {
      id: topicId,
    },
  });

  console.log("deletedTopic", deletedTopic);

  return {
    code: 0,
    msg: "ok",
    data: {
      topic: deletedTopic,
      notes: deletedNotes,
    },
  };
}

export async function db_DeleteNote(noteId: string) {
  const deletedNote = await prisma.note.delete({
    where: {
      id: noteId,
    },
  });

  console.log("deletedNote", deletedNote);

  return {
    code: 0,
    msg: "ok",
    data: deletedNote,
  };
}

export async function db_UpdateNote(noteId: string, note: any) {
  const updatedNote = await prisma.note.update({
    where: {
      id: noteId,
    },
    data: {
      title: note.title,
      content: note.content,
      tags: note.tags,
    },
  });

  console.log("updatedNote", updatedNote);

  return {
    code: 0,
    msg: "ok",
    data: updatedNote,
  };
}
