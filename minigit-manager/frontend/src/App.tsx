import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import RepositoryPage from "./pages/RepositoryPage";
import FileManagerPage from "./pages/FileManagerPage";
import StagingAreaPage from "./pages/StagingAreaPage";
import CommitsPage from "./pages/CommitsPage";
import VersionHistoryPage from "./pages/VersionHistoryPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { RepoProvider } from "./store/RepoContext";
import { SettingsProvider } from "./store/SettingsContext";
import { ToastProvider } from "./store/ToastContext";

export default function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <RepoProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/repository" element={<RepositoryPage />} />
                <Route path="/files" element={<FileManagerPage />} />
                <Route path="/staging" element={<StagingAreaPage />} />
                <Route path="/commits" element={<CommitsPage />} />
                <Route path="/history" element={<VersionHistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RepoProvider>
      </ToastProvider>
    </SettingsProvider>
  );
}
