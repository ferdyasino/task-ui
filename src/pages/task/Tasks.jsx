import { useEffect, useState } from "react";
import { getAllTasks } from "../../api/tasks.js";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllTasks()
      .then((data) => setTasks(data))
      .catch((error) => {
        console.error("Failed to fetch tasks:", error.message);
        setError(error.message);
        if (error.message.includes("Unauthorized")) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      });
  }, []);

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const pendingCount = tasks.filter((t) => t.status.toLowerCase() === "pending").length;
  const doneCount = tasks.filter((t) => t.status.toLowerCase() === "done").length;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        px: 2,
        py: 2,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          My Tasks
        </Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>
            Add Task +
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={selected.length === 0}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ flex: 1, border: "1px solid #ddd", minHeight: 300 }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox disabled />
              </TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(task.id)}
                    onChange={() => toggleSelection(task.id)}
                  />
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2">
          {tasks.length} tasks total — {pendingCount} pending, {doneCount} done
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
