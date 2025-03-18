import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
    const { userLoggedIn, loading } = useAuth();

    if (loading) {
        return null; 
    }

    if (!userLoggedIn) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;