import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoutes';
import MainPage from './pages/MainPage';
import SignIn from './pages/SigninPage';
import SignUp from './pages/SignupPage';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import GrantsPage from './pages/GrantsPage';
import ConferencesPage from './pages/ConferencesPage';
import JournalsPage from './pages/JournalsPage';
import Nav from './components/Navs/UserPageNav';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Nav/>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <MainPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            /> */}
             <Route
              path="/grants"
              element={
                <ProtectedRoute>
                  <GrantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conferences"
              element={
                <ProtectedRoute>
                  <ConferencesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journals"
              element={
                <ProtectedRoute>
                  <JournalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;