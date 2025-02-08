import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setUserLoggedIn(!!user);
            setLoading(false);

            // Redirect logged-in users to dashboard if they access `/`
            if (user) {
                navigate("/dashboard", { replace: true });
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const logout = async () => {
        await signOut(auth);
        setUserLoggedIn(false);
        navigate("/signin"); // Ensure user is redirected after logging out
    };

    return (
        <AuthContext.Provider value={{ currentUser, userLoggedIn, loading, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
