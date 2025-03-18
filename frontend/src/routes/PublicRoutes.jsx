import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PublicRoute = ({ children }) => {
    const { userLoggedIn, loading } = useAuth();

    if (loading) {
        return null; // or a loading spinner
    }

    if (userLoggedIn) {
        return <Navigate to="/grants" replace />;
    }

    return children;
};

export default PublicRoute;