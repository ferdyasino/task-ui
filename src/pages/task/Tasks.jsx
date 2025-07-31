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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
  getAllTasks,
  createTask,
  deleteTask,
  updateTask,
  deleteTaskFile,
} from "../../api/tasks";

export default function Tasks() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
    file: null,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

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
    if (!window.confirm(`Are you sure you want to delete ${selected.length} task(s)?`)) return;

    try {
      await Promise.all(selected.map((id) => deleteTask(id)));
      setTasks((prev) => prev.filter((task) => !selected.includes(task.id)));
      setSelected([]);
      setError("");
    } catch (err) {
      console.error("Delete error:", err.message);
      setError("Failed to delete selected tasks.");
    }
  };

  const _deleteFile = async (taskId, fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteTaskFile(taskId, fileId);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, TaskFiles: (task.TaskFiles || []).filter((f) => f.id !== fileId) }
            : task
        )
      );
      setPreviewOpen(false);
      setError("");
    } catch (err) {
      console.error("Delete file error:", err.message);
      setError(err.message || "Failed to delete file.");
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

    const duplicate = tasks.some(
      (t) =>
        t.title.trim().toLowerCase() === form.title.trim().toLowerCase() &&
        t.id !== editingTask?.id
    );
    if (duplicate) {
      setError("A task with this title already exists.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.dueDate);

    if (!editingTask && selectedDate < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    if (editingTask) {
      const originalDate = new Date(editingTask.dueDate);
      const originalDateStr = originalDate.toISOString().split("T")[0];
      if (form.dueDate !== originalDateStr && selectedDate < today) {
        setError("Due date cannot be set to a past date.");
        return;
      }
    }

    _saveTask();
  };

  const _saveTask = async () => {
    try {
      let payload;
      if (form.file) {
        payload = new FormData();
        payload.append("title", form.title);
        payload.append("description", form.description);
        payload.append("status", form.status);
        payload.append("dueDate", form.dueDate);
        payload.append("file", form.file);
      } else {
        payload = {
          title: form.title,
          description: form.description,
          status: form.status,
          dueDate: form.dueDate,
        };
      }

      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
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
    setForm({
      title: "",
      description: "",
      status: "pending",
      dueDate: "",
      file: null,
    });
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
                "&:hover": { background: "linear-gradient(to right, #0052cc, #4a90e2)" },
              }}
              onClick={() => {
                setModalOpen(true);
                setEditingTask(null);
                setForm({ title: "", description: "", status: "pending", dueDate: "", file: null });
                setError("");
              }}
            >
              Add Task +
            </Button>
          )}
          <Button variant="outlined" color="error" disabled={selected.length === 0} onClick={_deleteTasks}>
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
              <TableCell><strong>File</strong></TableCell>
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
                    file: null,
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
                <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</TableCell>
                <TableCell>
                  {task.TaskFiles?.length > 0 ? (
                    task.TaskFiles.map((file) => {
                      const ext = file.filetype?.toLowerCase() || "";
                      const isImage = ext.startsWith("image/");
                      const isVideo = ext.startsWith("video/");

                      return (
                        <Box
                          key={file.id}
                          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isImage && (
                            <img
                              src={file.fileurl}
                              alt={file.filename}
                              onClick={() => {
                                setPreviewFile({ ...file, taskId: task.id });
                                setPreviewOpen(true);
                              }}
                              style={{
                                width: 60,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                cursor: "pointer"
                              }}
                            />
                          )}

                          {isVideo && (
                            <video
                              src={file.fileurl}
                              onClick={() => {
                                setPreviewFile({ ...file, taskId: task.id });
                                setPreviewOpen(true);
                              }}
                              style={{
                                width: 100,
                                height: 60,
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                objectFit: "cover"
                              }}
                            />
                          )}

                          {!isImage && !isVideo && (
                            <a
                              href={file.fileurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: 12, color: "#1976d2" }}
                            >
                              {file.filename}
                            </a>
                          )}
                        </Box>
                      );
                    })
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stats */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          {tasks.length} tasks — {pendingCount} pending, {doneCount} done
        </Typography>
      </Box>

      {/* Task Form Dialog */}
      <Dialog open={modalOpen} onClose={(e, r) => { if (r !== "backdropClick") _resetForm(); }} fullWidth maxWidth="sm" disableEscapeKeyDown>
        <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" name="title" label="Title" value={form.title} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" name="description" label="Description" value={form.description} onChange={handleInputChange}/>
          <TextField fullWidth margin="normal" name="status" label="Status" select value={form.status} onChange={handleInputChange}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
          <TextField fullWidth margin="normal" name="dueDate" label="Due Date" type="date" value={form.dueDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }}/>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">Attach File</Typography>
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => setForm((prev) => ({ ...prev, file: e.target.files[0] || null }))}/>
            {form.file && <Typography variant="caption">Selected: {form.file.name}</Typography>}
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={_resetForm}>Cancel</Button>
          <Button onClick={_submitTask} variant="contained">{editingTask ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {previewFile?.filename}
          <DeleteForeverIcon color="error" sx={{ cursor: "pointer" }} onClick={() => _deleteFile(previewFile.taskId, previewFile.id)}/>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          {previewFile?.filetype?.startsWith("image/") && (
            <img
              src={previewFile.fileurl}
              alt={previewFile.filename}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain"
              }}
            />
          )}
          {previewFile?.filetype?.startsWith("video/") && (
            <video
              src={previewFile.fileurl}
              controls
              autoPlay
              style={{
                maxWidth: "100%",
                maxHeight: "80vh"
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
