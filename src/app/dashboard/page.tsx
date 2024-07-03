"use client";

import { useRouter } from "next/navigation";
import { authCall } from "../login/actions";
import { useEffect, useState } from "react";
import { db_findUser, signOutCall } from "./actions";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Topic from "@/components/topic";
import { signOut } from "@/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([
    {
      id: "1",
      title: "Topic 1",
      tags: ["tag1", "tag2", "tag3"],
    },
    {
      id: "2",
      title: "Topic 1",
      tags: ["tag1", "tag2", "tag3"],
    },
    {
      id: "3",
      title: "Topic 1",
      tags: ["tag1", "tag2", "tag3"],
    },
    {
      id: "4",
      title: "Topic 1",
      tags: ["tag1", "tag2", "tag3"],
    },
    {
      id: "5",
      title: "Topic 1",
      tags: ["tag1", "tag2", "tag3"],
    },
  ]);

  async function getUserInfo(id: string) {
    let r = await db_findUser(id);
    console.log(r);
    if (r.code === 0) {
      setUser(r.data);
    }
  }

  async function authCheck() {
    let r = await authCall();
    console.log(r);
    if (r.code !== 0) {
      router.push("/login");
    } else {
      getUserInfo(r.data.user.id);
    }
  }

  function AddTopicDialogContent() {
    const [notes, setNotes] = useState<any[]>([]);

    function addNote() {
      setNotes((prev) => [
        ...prev,
        {
          order: String(prev.length + 1),
          content: "",
          tags: [],
        },
      ]);
    }
    return (
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
            <Input id="title" defaultValue="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" defaultValue="" className="col-span-3" />
          </div>
          {notes.map((note) => {
            return (
              <div className="grid gap-4 py-4 border-t" key={note.order}>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    Note
                  </Label>
                  <Textarea
                    id="note"
                    defaultValue={note.content}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    Tags
                  </Label>
                  <Input id="note" className="col-span-3" />
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={addNote}>
            Add Note
          </Button>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  async function logOutFun() {
    await signOutCall();
    router.push("/login");
  }

  useEffect(() => {
    authCheck();
  }, []);
  return (
    <>
      {user && (
        <div className=" min-h-dvh min-w-dvw flex flex-col gap-4 bg-slate-50">
          <div className=" sticky top-0 w-full p-4 border-b bg-slate-50 flex items-center gap-4 justify-end">
            <div className=" font-semibold ">{user.username}</div>
            <Button variant="ghost" onClick={logOutFun}>
              <LogOut className="mr-2 h-4 w-4" />
              LogOut
            </Button>
          </div>
          <div className=" w-full flex-grow flex flex-row overflow-scroll">
            {topics.map((topic) => {
              return <Topic key={topic.id} {...topic} />;
            })}
          </div>

          <Dialog>
            <DialogTrigger>
              <div className=" fixed bottom-10 right-10 rounded-2xl bg-slate-800 z-10 p-4">
                <Plus className=" text-white" />
              </div>
            </DialogTrigger>
            <AddTopicDialogContent />
          </Dialog>
        </div>
      )}
    </>
  );
}
