import React from "react";
import TaskList from "@/components/TaskList";

function page() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 py-20">
      <h1 className="text-4xl font-bold">Task Manager</h1>
      <div className="w-full max-w-xl space-y-5">
        <TaskList />
      </div>
    </div>
  );
}

export default page;
