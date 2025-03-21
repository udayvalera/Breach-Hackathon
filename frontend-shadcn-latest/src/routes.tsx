import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreditLookup from './pages/CreditLookup';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/lookup" element={<CreditLookup />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  );
}