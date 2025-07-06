import { useEffect, useState } from "react";
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import { getAllTasks, createTask } from "../../api/tasks.js";

const API_BASE = "http://localhost:4000/api/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    _getAllTasks();
  }, []);

  const _getAllTasks = () => {
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
  };

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      for (let id of selected) {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to delete task ID ${id}`);
      }
      setTasks((prev) => prev.filter((task) => !selected.includes(task.id)));
      setSelected([]);
    } catch (err) {
      console.error("Delete error:", err.message);
      setError("Failed to delete selected tasks.");
    }
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const _submitTask = async () => {
  if (!form.title.trim() || !form.dueDate) {
    setError("Title and Due Date are required.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (editingTask) {
      const response = await fetch(`${API_BASE}/${editingTask.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to update task.");
      }

      console.log("Updated task response received");
      
      await _getAllTasks();
    } else {
      const response = await createTask(form);
      const newTask = response.task;
      setTasks((prev) => [newTask, ...prev]);
    }

    setModalOpen(false);
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      status: "pending",
      dueDate: "",
    });
    setError("");
  } catch (err) {
    console.error("Task save error:", err.message);
    setError(err.message);
  }
};


  const pendingCount = tasks.filter((t) => t.status?.toLowerCase() === "pending").length;
  const doneCount = tasks.filter((t) => t.status?.toLowerCase() === "done").length;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        px: 2,
        py: 2,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          My Tasks
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => {
              setModalOpen(true);
              setEditingTask(null);
              setForm({
                title: "",
                description: "",
                status: "pending",
                dueDate: "",
              });
              setError("");
            }}
          >
            Add Task +
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={selected.length === 0}
            onClick={handleDeleteTasks}
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
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow
                key={task.id ?? `row-${index}`}
                hover
                onClick={() => {
                  console.log("Editing task:", task);
                  setEditingTask(task);
                  setModalOpen(true);
                  setForm({
                    title: task.title || "",
                    description: task.description || "",
                    status: task.status || "pending",
                    dueDate: task.dueDate?.split("T")[0] || "",
                  });
                  setError("");
                }}

                style={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelection(task.id)}
                  />
                </TableCell>
                <TableCell>{task.title || "—"}</TableCell>
                <TableCell>{task.description || "—"}</TableCell>
                <TableCell>{task.status || "—"}</TableCell>
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
      </Box>

      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            name="title"
            label="Title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            value={form.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="status"
            label="Status"
            select
            value={form.status}
            onChange={handleInputChange}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            name="dueDate"
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalOpen(false);
              setEditingTask(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={_submitTask} variant="contained">
            {editingTask ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
