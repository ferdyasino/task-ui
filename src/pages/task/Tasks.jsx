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
  MenuItem,
  Alert,
} from "@mui/material";
import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../../api/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmPastDate, setConfirmPastDate] = useState(false);
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

  const _getAllTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
  };

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const _deleteTasks = async () => {
    try {
      for (let id of selected) {
        await deleteTask(id);
      }
      setTasks((prev) => prev.filter((task) => !selected.includes(task.id)));
      setSelected([]);
      setError("");
    } catch (err) {
      console.error("Delete error:", err.message);
      setError("Failed to delete selected tasks.");
    }
  };

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const _submitTask = () => {
    if (!form.title.trim() || !form.dueDate) {
      setError("Title and Due Date are required.");
      return;
    }

    // Duplicate title check (case-insensitive, ignore same task)
    const duplicate = tasks.some(
      (t) =>
        t.title.trim().toLowerCase() === form.title.trim().toLowerCase() &&
        t.id !== editingTask?.id
    );
    if (duplicate) {
      setError("A task with this title already exists.");
      return;
    }

    // Past due date check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.dueDate);

    if (selectedDate < today) {
      setConfirmPastDate(true);
      return;
    }

    _saveTask();
  };

  const _saveTask = async () => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, form);
      } else {
        await createTask(form);
      }
      await _getAllTasks();
      _resetForm();
    } catch (err) {
      console.error("Task save error:", err.message);
      setError(err.message);
    }
  };

  const _resetForm = () => {
    setModalOpen(false);
    setEditingTask(null);
    setForm({ title: "", description: "", status: "pending", dueDate: "" });
    setError("");
    setConfirmPastDate(false);
  };

  const pendingCount = tasks.filter((t) => t.status?.toLowerCase() === "pending").length;
  const doneCount = tasks.filter((t) => t.status?.toLowerCase() === "done").length;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">My Tasks</Typography>
        <Box>
          {!editingTask && (
            <Button
              variant="contained"
              sx={{
                mr: 1,
                color: "white",
                background: "linear-gradient(to right, #4a90e2, #0052cc)",
                "&:hover": {
                  background: "linear-gradient(to right, #0052cc, #4a90e2)",
                },
              }}
              onClick={() => {
                setModalOpen(true);
                setEditingTask(null);
                setForm({ title: "", description: "", status: "pending", dueDate: "" });
                setError("");
              }}
            >
              Add Task +
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            disabled={selected.length === 0}
            onClick={_deleteTasks}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Task Table */}
      <TableContainer component={Paper} sx={{ flex: 1, border: "1px solid #ddd" }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
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

      {/* Task Stats */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {tasks.length} tasks — {pendingCount} pending, {doneCount} done
        </Typography>
      </Box>

      {/* Task Form Dialog */}
      <Dialog open={modalOpen} onClose={_resetForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingTask ? "Edit Task" : "Add New Task"}
        </DialogTitle>
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
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={_resetForm}>Cancel</Button>
          <Button
            onClick={_submitTask}
            variant="contained"
            sx={{
              fontWeight: "bold",
              color: "white",
              background: "linear-gradient(to right, #4a90e2, #0052cc)",
              "&:hover": {
                background: "linear-gradient(to right, #0052cc, #4a90e2)",
              },
            }}
          >
            {editingTask ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Past Due Date Confirmation */}
      <Dialog open={confirmPastDate} onClose={() => setConfirmPastDate(false)}>
        <DialogTitle>Past Due Date</DialogTitle>
        <DialogContent>
          The selected due date is in the past. Are you sure you want to proceed?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPastDate(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setConfirmPastDate(false);
              _saveTask();
            }}
            variant="contained"
            color="warning"
          >
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
