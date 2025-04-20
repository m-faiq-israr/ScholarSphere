import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoutes';
import MainPage from './pages/MainPage';
import SignIn from './pages/SigninPage';
import SignUp from './pages/SignupPage';
import { AppProvider } from './contexts/AppContext';
import UserProfile from './pages/UserProfile';
import GrantsPage from './pages/GrantsPage';
import ConferencesPage from './pages/ConferencesPage';
import JournalsPage from './pages/JournalsPage';
import Nav from './components/Navs/UserPageNav';
import RecommendedGrantsPage from './pages/recommendedGrants';
import RecommendedConferencesPage from './pages/RecommendedConferences';
import RecommendedJournalsPage from './pages/RecommendedJournals';

function AppContent() {
  const location = useLocation();
  const isPublicRoute = ["/", "/signin", "/signup"].includes(location.pathname);

  return (
    <>
      {!isPublicRoute && <Nav />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <MainPage />
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
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grants/recommended-grants"
          element={
            <ProtectedRoute>
              <RecommendedGrantsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/conferences/recommended-conferences"
          element={
            <ProtectedRoute>
              <RecommendedConferencesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journals/recommended-journals"
          element={
            <ProtectedRoute>
              <RecommendedJournalsPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
