import React from "react";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Howdy! Welcome to TaskMan (beta)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your tasks efficiently and easily.
        </Typography>
      </Box>
    </Box>
  );
}
