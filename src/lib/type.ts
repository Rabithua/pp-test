export type TopicWithNotes = {
  id?: string;
  userId?: string;
  title: string;
  content: string;
  tags: string;
  notes: Note[];
};

export type Note = {
  id?: string;
  order: number;
  title: string;
  content: string;
  tags: string;
  topicId?: string;
};

export type Topics = TopicWithNotes[];

export type TopicActions =
  | { type: "addOne"; topic: TopicWithNotes }
  | { type: "add"; topics: Topics }
  | { type: "freshAll"; topics: Topics }
  | { type: "updateOne"; topic: TopicWithNotes }
  | { type: "deleteOne"; topicId: string };
