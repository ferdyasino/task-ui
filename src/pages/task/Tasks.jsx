// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import { getAllTasks } from "../../api/tasks";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getAllTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Failed to fetch tasks:", error);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 180,
      valueGetter: ({ row }) =>
        row?.dueDate ? new Date(row.dueDate).toLocaleDateString() : "—",
    }
  ];

  return (
    <Paper sx={{ height: 500, width: "100%", p: 2 }}>
      <h2>Tasks</h2>
      <p>Found {tasks.length} tasks</p>
      <DataGrid
        rows={tasks}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        sx={{ border: 0, backgroundColor: "#fff" }}
      />
    </Paper>
  );
}
