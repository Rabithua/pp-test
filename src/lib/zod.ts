import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

export const topicSchema = z.object({
  title: z.string().min(1, "Topic title is required"),
  content: z.string().min(1, "Topic content is required").default(""),
  tags: z.string().default(""),
  notes: z
    .array(
      z.object({
        title: z.string().min(1, "Note title is required"),
        content: z.string().min(1, "Note content is required"),
        tags: z.string().default(""),
      })
    )
    .default([]),
});
