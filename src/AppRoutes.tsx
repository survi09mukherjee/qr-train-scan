import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SessionList from "./pages/sessions/SessionList";
import CreateSession from "./pages/sessions/CreateSession";
import SessionDetails from "./pages/sessions/SessionDetails";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/NotFound";
import QRScanner from "./pages/QRScanner";
import ScanHistory from "./pages/history/ScanHistory";
import UserList from "./pages/admin/UserList";
import Support from "./pages/Support";
import TrainLivePage from "./pages/train/TrainLivePage";

// Placeholder for protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // TODO: Add actual auth check
    const isAuthenticated = true;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/sessions"
                element={
                    <ProtectedRoute>
                        <SessionList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/sessions/new"
                element={
                    <ProtectedRoute>
                        <CreateSession />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/sessions/:id"
                element={
                    <ProtectedRoute>
                        <SessionDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/scan"
                element={
                    <ProtectedRoute>
                        <QRScanner />
                    </ProtectedRoute>
                }
            />

            {/* Logs/History Route */}
            <Route
                path="/logs"
                element={
                    <ProtectedRoute>
                        <ScanHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <UserList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/support"
                element={
                    <ProtectedRoute>
                        <Support />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/train/:trainId"
                element={
                    <ProtectedRoute>
                        <TrainLivePage />
                    </ProtectedRoute>
                }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
