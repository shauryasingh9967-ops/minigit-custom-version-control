const express = require("express");
const cors = require("cors");
const { ensureDir, DATA_ROOT, writeJSON } = require("./utils/fileStore");
const path = require("path");
const fs = require("fs");

const repoRoutes = require("./routes/repoRoutes");
const fileRoutes = require("./routes/fileRoutes");
const stageRoutes = require("./routes/stageRoutes");
const commitRoutes = require("./routes/commitRoutes");
const historyRoutes = require("./routes/historyRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Bootstrap data directory + index files on first run
ensureDir(DATA_ROOT);
const reposIndexPath = path.join(DATA_ROOT, "repositories.json");
if (!fs.existsSync(reposIndexPath)) writeJSON(reposIndexPath, []);
const settingsPath = path.join(DATA_ROOT, "settings.json");
if (!fs.existsSync(settingsPath)) {
  writeJSON(settingsPath, { theme: "dark", appName: "Mini Git Manager", version: "1.0.0" });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "minigit-manager-backend" });
});

app.use("/api/repos", repoRoutes);
app.use("/api/repos/:repoId/files", fileRoutes);
app.use("/api/repos/:repoId/stage", stageRoutes);
app.use("/api/repos/:repoId/commits", commitRoutes);
app.use("/api/repos/:repoId/history", historyRoutes);
app.use("/api/settings", settingsRoutes);

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Mini Git Manager backend running on http://localhost:${PORT}`);
});
