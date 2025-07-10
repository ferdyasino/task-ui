import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setStatus({ type: "error", message: "Email is required." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const res = await fetch("http://localhost:4000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send reset link.");
      }

      setStatus({ type: "success", message: "Reset link sent to your email." });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Forgot Password
        </Typography>
        <Typography variant="body2" mb={2}>
          Enter your registered email address and we'll send you a password reset link.
        </Typography>

        {status.message && (
          <Alert severity={status.type} sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(to right, #4a90e2, #0052cc)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(to right, #0052cc, #4a90e2)',
            },
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </Paper>
    </Box>
  );
}
