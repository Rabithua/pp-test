export default function Topic(topic: any) {
  return (
    <div className=" flex flex-col gap-4">
      <div className=" m-4 mb-0 p-4 flex flex-col gap-4 max-w-5/6 w-80 bg-white border">
        <div className=" font-semibold text-lg">{topic.title}</div>
        <div className=" flex flex-row gap-2 flex-wrap">
          {topic.tags.map((tag: string) => (
            <div
              key={tag}
              className=" bg-slate-100 py-1 px-2 rounded-sm text-sm"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
