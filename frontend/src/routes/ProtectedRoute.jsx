import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = ({ children }) => {
    const { userLoggedIn, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return userLoggedIn ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
