// 使用context加reducer作为全局状态管理系统
"use client";

import { Topics, TopicActions } from "@/lib/type";
import React, { createContext, useContext, useReducer, ReactNode } from "react";

const TopicsContext = createContext<Topics | null>(null);
const TopicsDispatchContext =
  createContext<React.Dispatch<TopicActions> | null>(null);

export function TopicsProvider({ children }: { children: ReactNode }) {
  const [topics, dispatch] = useReducer(TopicsReducer, initialTopics);

  return (
    <TopicsContext.Provider value={topics}>
      <TopicsDispatchContext.Provider value={dispatch}>
        {children}
      </TopicsDispatchContext.Provider>
    </TopicsContext.Provider>
  );
}

export function useTopics() {
  const context = useContext(TopicsContext);
  if (context === null) {
    throw new Error("useTopics must be used within a TopicsProvider");
  }
  return context;
}

export function useTopicsDispatch() {
  const context = useContext(TopicsDispatchContext);
  if (context === null) {
    throw new Error("useTopicsDispatch must be used within a TopicsProvider");
  }
  return context;
}

function TopicsReducer(topics: Topics, action: TopicActions): Topics {
  switch (action.type) {
    case "add": {
      const topics_unOrder = [...topics, ...action.topics];
      return topics_unOrder;
    }

    case "addOne": {
      const topics_unOrder = [...topics, action.topic];
      return topics_unOrder;
    }

    case "deleteOne": {
      return topics.filter((topic) => topic.id !== action.topicId);
    }

    case "freshAll": {
      return action.topics;
    }

    case "updateOne": {
      // 替换topics中topic.id与action.topic.id相同的对象，替换为action.rotr
      return topics.map((topic) =>
        topic.id === action.topic.id ? action.topic : topic
      );
    }

    default: {
      throw new Error("Unknown action: " + action);
    }
  }
}

const initialTopics = [] as Topics;
