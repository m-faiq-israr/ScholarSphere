import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoutes";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SigninPage";
import SignUp from "./pages/SignupPage";
import UserPage from "./pages/UserPage";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
                    <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
