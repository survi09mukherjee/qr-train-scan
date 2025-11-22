import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SessionList from "./pages/sessions/SessionList";
import CreateSession from "./pages/sessions/CreateSession";
import SessionDetails from "./pages/sessions/SessionDetails";
import NotFound from "./pages/NotFound";
import QRScanner from "./pages/QRScanner";
import ScanHistory from "./pages/history/ScanHistory";
import TrainLivePage from "./pages/train/TrainLivePage";
import Index from "./pages/Index";
import PNRStatus from "./pages/PNRStatus";
import StationControl from "./pages/StationControl";
import TrainDetails from "./pages/TrainDetails";

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
            <Route path="/" element={<Index />} />
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
                path="/scan"
                element={<QRScanner />}
            />
            <Route
                path="/train/:trainId"
                element={<TrainLivePage />}
            />
            <Route
                path="/pnr-status"
                element={<PNRStatus />}
            />
            <Route
                path="/station-control"
                element={<StationControl />}
            />
            <Route
                path="/train-details"
                element={<TrainDetails />}
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
