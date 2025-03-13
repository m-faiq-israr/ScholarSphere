import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoutes";
import MainPage from "./pages/MainPage";
import SignIn from "./pages/SigninPage";
import SignUp from "./pages/SignupPage";
import UserPage from "./pages/UserPage";
import { AppProvider } from "./contexts/AppContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
        <AuthProvider>
      <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><MainPage /></PublicRoute>} />
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </AppProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;