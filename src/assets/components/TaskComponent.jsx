import { useEffect, useState } from "react";
import { getAllTasks } from "../data/tasks";

export default function TaskComponent() {
    const [tasks, setTasks] = useState([]);

    const  _getTasks = async () => {
        const allTasks = await getAllTasks();
        setTasks(allTasks);
    };

    useEffect(() => {
        _getTasks();
    },[]);

    return (
        <>
            <div> Found {tasks.length} tasks </div>
        </>
    );
}