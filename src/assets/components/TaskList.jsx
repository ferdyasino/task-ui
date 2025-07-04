import { useState } from "react";
import TaskCard from "./TaskCard";
import { sampleTask } from "../data/sampleTask";

export default function TaskList() {
  const [tasks, setTasks] = useState(sampleTask);

  const toggleTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updated);
  };

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} toggle={toggleTask} />
      ))}
    </div>
  );
}
