// src/main.jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import QRScanPage from "./pages/QRScan";
import LockersPage from "./pages/Lockers";
import TrainingPage from "./pages/Training";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/open" element={<QRScanPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LockersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute>
              <TrainingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
