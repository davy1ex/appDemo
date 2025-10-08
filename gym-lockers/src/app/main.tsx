import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./providers";
import { LockersPage } from "@/pages/lockers";
import { QRScanPage } from "@/pages/qr-scan";
import { TrainingPage } from "@/pages/training";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppProvider>
      <Routes>
        <Route path="/" element={<QRScanPage />} />
        <Route path="/open" element={<QRScanPage />} />
        <Route path="/lockers" element={<LockersPage />} />
        <Route path="/training" element={<TrainingPage />} />
      </Routes>
    </AppProvider>
  </BrowserRouter>
);
