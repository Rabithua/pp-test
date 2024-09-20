import { db_DeleteNote, db_UpdateNote } from "@/app/dashboard/actions";
import { useTopicsDispatch } from "@/state/topics";
import { Note } from "@prisma/client";
import { ToastAction } from "@/components/ui/toast";
import { Trash2 } from "lucide-react";
import { toast } from "./ui/use-toast";
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
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function NoteCard({ note, topic }: any) {
  const topicsDispatch = useTopicsDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note_temp, setNote_temp] = useState(note);

  function deleteNote(id: string) {
    console.log("delete note");
    async function deleteM() {
      let r = await db_DeleteNote(id);
      console.log(r);
      topicsDispatch({
        type: "updateOne",
        topic: {
          ...topic,
          notes: topic.notes.filter((n: Note) => n.id !== id),
        },
      });
    }
    toast({
      title: "Note Deleted",
      description: "Note will be deleted, you sure?",
      duration: 2000,
      action: (
        <ToastAction altText="DeleteNotes" onClick={deleteM}>
          Delete
        </ToastAction>
      ),
    });
  }

  async function submit() {
    console.log("submit", note_temp);
    let r = await db_UpdateNote(note_temp.id, note_temp);
    if (r.code === 0) {
      topicsDispatch({
        type: "updateOne",
        topic: {
          ...topic,
          notes: topic.notes.map((n: Note) => {
            if (n.id === note.id) {
              return note_temp;
            } else {
              return n;
            }
          }),
        },
      });
      setDialogOpen(false);
    }
  }

  function noteClickHandle() {
    if (topic.userId !== topic.uid) return;
    setDialogOpen(true);
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          className=" cursor-pointer relative mx-4 my-2 p-4 flex flex-col gap-2 max-w-5/6 w-80 bg-slate-200 border"
          onClick={noteClickHandle}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 0.95 }}
          whileTap={{
            scale: 0.9,
          }}
        >
          {topic.userId === topic.uid && (
            <div
              className=" duration-300 hover:bg-black/10 p-2 rounded-md w-fit cursor-pointer absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id || "");
              }}
            >
              <Trash2 className=" w-4 h-4" />
            </div>
          )}

          <div className=" font-semibold text-lg max-w-60">{note.title}</div>
          <div className=" text-base">{note.content}</div>
          <div className=" flex flex-row gap-2 flex-wrap">
            {note.tags &&
              note.tags.split(" ").map((tag: string) => (
                <div
                  key={tag}
                  className=" cursor-pointer bg-slate-100 py-1 px-2 rounded-sm text-sm"
                >
                  {tag}
                </div>
              ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Edit notes dialog</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-2 max-h-[60dvh] overflow-y-scroll scroll-smooth">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Title
              </Label>
              <Input
                id="noteTitle"
                className="col-span-3"
                defaultValue={note.title}
                onChange={(e) => {
                  setNote_temp((prev: Note) => {
                    return {
                      ...prev,
                      title: e.target.value,
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
                  setNote_temp((prev: Note) => {
                    return {
                      ...prev,
                      content: e.target.value,
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
                  setNote_temp((prev: Note) => {
                    return {
                      ...prev,
                      tags: e.target.value.trim(),
                    };
                  });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <div className=" flex gap-2 flex-wrap justify-center">
              <Button onClick={submit}>Save changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
