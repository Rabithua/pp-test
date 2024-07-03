"use client";

import { TopicWithNotes } from "@/lib/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Delete, Menu, Plus, Trash2 } from "lucide-react";
import {
  db_DeleteNote,
  db_DeleteTopic,
  db_UpdateTopic,
} from "@/app/dashboard/actions";
import { toast } from "./ui/use-toast";
import { useTopicsDispatch } from "@/state/topics";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { topicSchema } from "@/lib/zod";
import { ToastAction } from "./ui/toast";
import { Note } from "@prisma/client";
import NoteCard from "./note";

export default function Topic(topic: any) {
  console.log("topic", topic);
  const dialogRef = useRef(null);
  const topicsDispatch = useTopicsDispatch();
  const [dropOpen, setDropOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [topic_temp, setTopic_temp] = useState(topic);

  async function deleteTopic() {
    console.log("delete topic", topic.id);
    async function deleteM() {
      let r = await db_DeleteTopic(topic.id || "");
      console.log(r);
      if (r.code === 0) {
        toast({
          title: "Topic Deleted",
          description: "Topic has been deleted",
          duration: 2000,
        });
        topicsDispatch({ type: "deleteOne", topicId: topic.id || "" });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete topic",
          duration: 4000,
        });
      }
    }
    toast({
      title: "Topic Deleted",
      description: "Topic will be deleted, you sure?",
      duration: 5000,
      action: (
        <ToastAction altText="DeleteNotes" onClick={deleteM}>
          Delete
        </ToastAction>
      ),
    });
  }

  function addNote() {
    setTopic_temp((prev: TopicWithNotes) => {
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
    // 滑动到容器底部
    setTimeout(() => {
      console.log(dialogRef);
      if (dialogRef.current) {
        // @ts-ignore
        dialogRef.current.scrollTop = dialogRef.current.scrollHeight;
      }
    }, 0);
  }

  function copyShareUrl() {
    console.log("copy share url");
    navigator.clipboard.writeText(
      `${window.location.origin}/topic/${topic.id}`
    );
    toast({
      title: "Copied",
      description: "Share URL copied to clipboard",
      duration: 2000,
    });
  }

  async function submit() {
    console.log("submit", topic_temp);
    let m = topicSchema.safeParse(topic_temp);
    console.log(m);
    if (m.success) {
      let r = await db_UpdateTopic(topic_temp);
      console.log(r);
      topicsDispatch({
        type: "updateOne",
        topic: r.data,
      });
      setDialogOpen(false);
    } else {
      toast({
        title: "Uh oh!",
        description: JSON.parse(m.error.message)[0].message,
      });
      return;
    }
  }

  return (
    <div className=" flex flex-col gap-2 h-fit pb-6">
      <div className=" m-4 mb-0 p-4 flex relative flex-col gap-2 max-w-5/6 w-80 bg-white border">
        {topic.userId === topic.uid && (
          <div className=" absolute right-4 top-4">
            <DropdownMenu open={dropOpen} onOpenChange={setDropOpen}>
              <DropdownMenuTrigger>
                <Menu
                  className=" w-4"
                  onClick={() => {
                    setDropOpen(!dropOpen);
                  }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteTopic}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyShareUrl}>
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className=" font-semibold text-lg max-w-60">{topic.title}</div>
        <div className=" text-base">{topic.content}</div>
        <div className=" flex flex-row gap-2 flex-wrap">
          {topic.tags &&
            topic.tags.split(" ").map((tag: string) => (
              <div
                key={tag}
                className=" bg-slate-100 py-1 px-2 rounded-sm text-sm"
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
      {topic.notes.map((note: Note) => {
        return <NoteCard key={note.id} note={note} topic={topic}></NoteCard>;
      })}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
            <DialogDescription>
              Edit a topic with notes and tags
            </DialogDescription>
          </DialogHeader>
          <div
            className="grid gap-4 py-4 px-2 max-h-[60dvh] overflow-y-scroll scroll-smooth"
            ref={dialogRef}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                defaultValue={topic_temp.title}
                className="col-span-3"
                onChange={(e) => {
                  setTopic_temp((prev: TopicWithNotes) => {
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
                defaultValue={topic_temp.content}
                className="col-span-3"
                onChange={(e) => {
                  setTopic_temp((prev: TopicWithNotes) => {
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
                  setTopic_temp((prev: TopicWithNotes) => {
                    return {
                      ...prev,
                      tags: e.target.value,
                    };
                  });
                }}
                defaultValue={topic_temp.tags}
              />
            </div>
            {topic_temp.notes.map((note: Note, index: number) => {
              return (
                <div className="grid gap-4 py-4 border-t" key={note.order}>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="note" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="noteTitle"
                      className="col-span-3"
                      defaultValue={note.title}
                      onChange={(e) => {
                        setTopic_temp((prev: TopicWithNotes) => {
                          return {
                            ...prev,
                            notes: prev.notes.map((n: any, i: number) => {
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
                      defaultValue={note.content}
                      onChange={(e) => {
                        setTopic_temp((prev: TopicWithNotes) => {
                          return {
                            ...prev,
                            notes: prev.notes.map((n: any, i: number) => {
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
                      defaultValue={note.tags}
                      onChange={(e) => {
                        setTopic_temp((prev: TopicWithNotes) => {
                          return {
                            ...prev,
                            notes: prev.notes.map((n: any, i: number) => {
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
    </div>
  );
}
