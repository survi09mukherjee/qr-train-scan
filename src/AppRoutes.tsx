import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SearchTrain from './pages/SearchTrain';
import QRScanner from './pages/QRScanner';
import TrainDetails from './pages/TrainDetails';
import TrainLivePage from './pages/train/TrainLivePage';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchTrain />} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/train/:trainNumber/live" element={<TrainLivePage />} />
            <Route path="/train/:trainNumber" element={<TrainDetails />} />
        </Routes>
    );
};

export default AppRoutes;
