import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Checkbox, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Alert
} from "@mui/material";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

export default function UserManagement() {
  const { authData, user } = useAuth();
  const token = authData?.token;

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "user", password: "", birthDate: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (user?.role === "admin" && token) {
      _getAllUsers();
    }
  }, [user, token]);

  const _getAllUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to load users.");
    }
  };

  const _deleteUsers = async () => {
    try {
      for (let id of selected) {
        await deleteUser(id, token);
      }
      setUsers(users.filter((u) => !selected.includes(u.id)));
      setSelected([]);
      setError("");
    } catch (err) {
      console.error("Delete users error:", err);
      setError(err.message || "Failed to delete users.");
    }
  };

  const toggleSelection = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const validateForm = () => {
    const { name, email, password, role, birthDate } = form;
    if (!name.trim() || !email.trim() || !birthDate.trim()) {
      return "Name, Email, and Birth Date are required.";
    }
    if (!editingUser && !password.trim()) {
      return "Password is required for new users.";
    }
    if (!["user", "admin"].includes(role)) {
      return "Invalid role selected.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format.";
    }
    if (editingUser && password && password !== "******" && password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      return "Invalid birth date format.";
    }
    if (birthDateObj > new Date()) {
      return "Birth date cannot be in the future.";
    }
    return "";
  };

  const _submitUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = { ...form };

      // Remove password from payload if editing and unchanged
      if (editingUser && payload.password === "******") {
        delete payload.password;
      }

      console.log("Submitting payload:", payload); // Debug payload

      if (editingUser) {
        await updateUser(editingUser.id, payload, token);
      } else {
        await createUser(payload, token);
      }

      await _getAllUsers();
      _closeModal();
    } catch (err) {
      console.error("User save error:", err);
      const errorMessage = err.message.includes("HTTP 400") ? err.message : "Failed to save user.";
      setError(errorMessage);
    }
  };

  const openAddUser = () => {
    setForm({ name: "", email: "", role: "user", password: "", birthDate: "" });
    setEditingUser(null);
    setError("");
    setModalOpen(true);
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role === "administrator" ? "admin" : u.role, // Map administrator to admin
      password: "******", // Masked for editing
      birthDate: u.birthDate ? u.birthDate.split("T")[0] : "", // Format for input
    });
    setModalOpen(true);
    setError("");
  };

  const _closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setForm({ name: "", email: "", role: "user", password: "", birthDate: "" });
    setError("");
  };

  if (user?.role !== "admin") {
    return <Typography variant="h6" sx={{ p: 3 }}>Access denied: Admins only</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">User Management</Typography>
        <Box>
          <Button variant="contained" sx={{ mr: 1 }} onClick={openAddUser}>Add User +</Button>
          <Button variant="outlined" color="error" disabled={selected.length === 0} onClick={_deleteUsers}>
            Delete
          </Button>
        </Box>
      </Box>

      {error && !modalOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Birth Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => openEditUser(u)}
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(u.id)}
                    onChange={() => toggleSelection(u.id)}
                  />
                </TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role === "admin" || u.role === "administrator" ? "Admin" : "User"}</TableCell>
                <TableCell>{u.birthDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={modalOpen}
        onClose={_closeModal}
        fullWidth
        maxWidth="sm"
        disableRestoreFocus // Prevent focus issues
        slotProps={{ backdrop: { sx: { pointerEvents: "none" } } }} // Avoid aria-hidden conflicts
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={form.name}
            onChange={handleInputChange}
            required
            error={!!error && error.includes("Name")}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            value={form.email}
            onChange={handleInputChange}
            required
            error={!!error && error.includes("Email")}
          />
          <TextField
            fullWidth
            margin="normal"
            name="birthDate"
            label="Birth Date"
            type="date"
            value={form.birthDate}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }} // Prevent future dates
            error={!!error && error.includes("Birth date")}
          />
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleInputChange}
            required={!editingUser}
            disabled={editingUser && form.password === "******"}
            error={!!error && error.includes("Password")}
          />
          <TextField
            fullWidth
            margin="normal"
            name="role"
            label="Role"
            select
            value={form.role}
            onChange={handleInputChange}
            error={!!error && error.includes("role")}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={_closeModal}>Cancel</Button>
          <Button variant="contained" onClick={_submitUser}>
            {editingUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}