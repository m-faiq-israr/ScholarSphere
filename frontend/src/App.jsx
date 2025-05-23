import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoutes';
import SignIn from './pages/Auth/SigninPage';
import SignUp from './pages/Auth/SignupPage';
import { AppProvider } from './contexts/AppContext';
import UserProfile from './pages/UserProfile';
import GrantsPage from './pages/GrantsPage';
import ConferencesPage from './pages/ConferencesPage';
import JournalsPage from './pages/JournalsPage';
import Nav from './components/Navs/UserPageNav';
import RecommendedGrantsPage from './pages/Recommend-Pages/RecommendedGrants';
import RecommendedConferencesPage from './pages/Recommend-Pages/RecommendedConferences';
import RecommendedJournalsByAbstract from './pages/Recommend-Pages/RecommendedJournalsByAbstract';
import { Toaster } from './components/ui/toaster';
import LandingPage from './pages/LandingPage';

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
            <LandingPage />
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
          path="/journals/recommend-by-abstract"
          element={
            <ProtectedRoute>
              <RecommendedJournalsByAbstract />
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
      <Toaster />
    </Router>
  );
}

export default App;
