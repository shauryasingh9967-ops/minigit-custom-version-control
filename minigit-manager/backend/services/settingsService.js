const path = require("path");
const { DATA_ROOT, readJSON, writeJSON, ensureDir } = require("../utils/fileStore");
const fs = require("fs");

const SETTINGS_PATH = () => path.join(DATA_ROOT, "settings.json");

const DEFAULT_SETTINGS = {
  theme: "dark",
  appName: "Mini Git Manager",
  version: "1.0.0",
};

function getSettings() {
  return readJSON(SETTINGS_PATH(), DEFAULT_SETTINGS);
}

function updateSettings(partial) {
  const current = getSettings();
  const next = { ...current, ...partial };
  writeJSON(SETTINGS_PATH(), next);
  return next;
}

function resetDemoData() {
  ensureDir(DATA_ROOT);
  const entries = fs.readdirSync(DATA_ROOT);
  for (const entry of entries) {
    fs.rmSync(path.join(DATA_ROOT, entry), { recursive: true, force: true });
  }
  writeJSON(SETTINGS_PATH(), DEFAULT_SETTINGS);
  writeJSON(path.join(DATA_ROOT, "repositories.json"), []);
  return true;
}

module.exports = { getSettings, updateSettings, resetDemoData, DEFAULT_SETTINGS };
