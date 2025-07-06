import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        disableGutters: true,
        maxWidth: false,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        },
      },
    },
  },
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#213547",
    },
  },
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});

export default theme;
