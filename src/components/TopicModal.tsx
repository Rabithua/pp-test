"use client";

import { db_CreatTopic } from "@/app/dashboard/actions";
import { topicSchema } from "@/lib/zod";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { useTopics, useTopicsDispatch } from "@/state/topics";
import { Plus } from "lucide-react";

export default function AddTopicButton({ user, scroll }: any) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const topics = useTopics();
  const topicsDispatch = useTopicsDispatch();
  const [topic, setTopic] = useState({
    title: "",
    content: "",
    tags: "",
    userId: user.id,
    notes: [] as any[],
  });

  function addNote() {
    setTopic((prev) => {
      return {
        ...prev,
        notes: [
          ...prev.notes,
          {
            order: prev.notes.length,
            title: "",
            content: "",
            tags: "",
          },
        ],
      };
    });
  }

  async function submit() {
    console.log("submit", topic);
    let m = topicSchema.safeParse(topic);
    console.log(m);
    if (m.success) {
      console.log("topic", topic);
      let r = await db_CreatTopic(topic, user.id);
      console.log(r);
      topicsDispatch({
        type: "addOne",
        topic: {
          ...r.data,
        },
      });
      setDialogOpen(false);
      setTimeout(() => {
        scroll();
      }, 0);
    } else {
      toast({
        title: "Uh oh!",
        description: JSON.parse(m.error.message)[0].message,
      });
      return;
    }
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger>
        <div
          className=" fixed bottom-10 right-10 rounded-2xl bg-slate-800 z-10 p-4"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <Plus className=" text-white" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Topic</DialogTitle>
          <DialogDescription>
            Create a new topic with notes and tags
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 px-2 max-h-[60dvh] overflow-y-scroll">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue=""
              className="col-span-3"
              onChange={(e) => {
                setTopic((prev) => {
                  return {
                    ...prev,
                    title: e.target.value,
                  };
                });
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="content"
              defaultValue=""
              className="col-span-3"
              onChange={(e) => {
                setTopic((prev) => {
                  return {
                    ...prev,
                    content: e.target.value,
                  };
                });
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Tags
            </Label>
            <Textarea
              id="tags"
              placeholder="tag1 tag2 tag3"
              className="col-span-3"
              onChange={(e) => {
                setTopic((prev) => {
                  return {
                    ...prev,
                    tags: e.target.value,
                  };
                });
              }}
            />
          </div>
          {topic.notes.map((note, index) => {
            return (
              <div className="grid gap-4 py-4 border-t" key={note.order}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="noteTitle"
                    className="col-span-3"
                    onChange={(e) => {
                      setTopic((prev) => {
                        return {
                          ...prev,
                          notes: prev.notes.map((n, i) => {
                            if (i === index) {
                              return {
                                ...n,
                                title: e.target.value,
                              };
                            }
                            return n;
                          }),
                        };
                      });
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="noteContent"
                    className="col-span-3"
                    onChange={(e) => {
                      setTopic((prev) => {
                        return {
                          ...prev,
                          notes: prev.notes.map((n, i) => {
                            if (i === index) {
                              return {
                                ...n,
                                content: e.target.value,
                              };
                            }
                            return n;
                          }),
                        };
                      });
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="noteTags"
                    className="col-span-3"
                    placeholder="tag1 tag2 tag3"
                    onChange={(e) => {
                      setTopic((prev) => {
                        return {
                          ...prev,
                          notes: prev.notes.map((n, i) => {
                            if (i === index) {
                              return {
                                ...n,
                                tags: e.target.value,
                              };
                            }
                            return n;
                          }),
                        };
                      });
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <div className=" flex gap-2 flex-wrap justify-center">
            <Button variant="secondary" onClick={addNote}>
              Add Note
            </Button>
            <Button onClick={submit}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
