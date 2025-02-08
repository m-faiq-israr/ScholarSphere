import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const PublicRoute = ({ children }) => {
    const { userLoggedIn, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return userLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
