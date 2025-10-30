import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./auth/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import ActionResultMessage from "./components/ActionResultMessage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          
          <ActionResultMessage />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
