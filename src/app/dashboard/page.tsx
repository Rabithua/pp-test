"use client";

import { useRouter } from "next/navigation";
import { authCall } from "../login/actions";
import { useEffect, useRef, useState } from "react";
import { db_GetAllTopics, db_findUser, signOutCall } from "./actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Topic from "@/components/topic";
import { useTopics, useTopicsDispatch } from "@/state/topics";
import AddTopicButton from "@/components/TopicModal";

export default function DashboardPage() {
  const scrollMain = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const topics = useTopics();
  const topicsDispatch = useTopicsDispatch();

  async function getAllTopic() {
    let r = await db_GetAllTopics(user.id);
    console.log(r);
    topicsDispatch({ type: "freshAll", topics: r.data });
  }

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

  async function logOutFun() {
    await signOutCall();
    router.push("/login");
  }

  function scrollHandler() {
    if (scrollMain.current) {
      scrollMain.current.scrollTo({
        top: 0,
        left: scrollMain.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    authCheck();
  }, []);

  useEffect(() => {
    if (user) {
      getAllTopic();
    }
  }, [user]);
  return (
    <>
      {user && (
        <div className=" h-dvh w-dvw flex flex-col bg-slate-50">
          <div className=" z-10 sticky top-0 w-full p-4 border-b bg-slate-50 flex items-center gap-4 justify-end">
            <div className=" font-semibold ">{user.username}</div>
            <Button variant="ghost" onClick={scrollHandler}>
              <LogOut className="mr-2 h-4 w-4" />
              LogOut
            </Button>
          </div>
          <div
            className=" w-full h-max flex-grow flex flex-row overflow-scroll"
            ref={scrollMain}
          >
            {topics.map((topic) => {
              return <Topic key={topic.id} {...topic} />;
            })}
          </div>
          <AddTopicButton user={user} scroll={scrollHandler} />
        </div>
      )}
    </>
  );
}
