"use client";

import { useParams } from "next/navigation";
import { db_getTopic } from "./actions";
import { useEffect, useState } from "react";
import Topic from "@/components/topic";

export default function TopicPage() {
  const param = useParams();
  const [topic, setTopic] = useState<any>({});

  async function getTopic() {
    let r = await db_getTopic(param.id.toString());
    console.log("getTopic", r);
    if (r) {
      setTopic(r);
    }
  }

  useEffect(() => {
    getTopic();
  }, []);
  return <div>{topic.id && <Topic key={topic.id} {...topic} />}</div>;
}
