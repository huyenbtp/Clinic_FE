import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // hoặc 'dark'

    primary: {
      main: "#3497F9", // màu xanh chủ đạo (nút chính, header,…)
      light: "#3497F9",
      dark: "#004ba0",
      contrastText: "#fff",
    },

    // Màu nền toàn cục
    background: {
      default: "#f1f8ff", // màu nền của toàn app
      paper: "#ffffff",   // màu của card, paper, box
    },

    // Màu chữ
    text: {
      primary: "#404040",
      secondary: "#6c7688",
      disabled: "#C9C9C9",
    },

    // Màu trạng thái (success, error, warning, info)
    success: { main: "#1ab362", light: '#dbfce7', dark: "#016630" },
    error: { main: "#e7000b", light: "#ffe1e1ff", dark: "#e7000b" },
    warning: { main: "#894b00", light: "#fef9c2", dark: "#894b00" },
    info: { main: "#193cb8", light: "#dbeafe", dark: "#193cb8", },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.75rem", fontWeight: 500 },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.875rem" },
  },

  // Tùy chỉnh bo góc, shadow, v.v.
  shape: {
    borderRadius: 8,
  },
});

export default theme;
