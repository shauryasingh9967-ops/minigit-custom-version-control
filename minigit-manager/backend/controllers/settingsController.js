const settingsService = require("../services/settingsService");

function getSettings(req, res, next) {
  try {
    res.json(settingsService.getSettings());
  } catch (err) {
    next(err);
  }
}

function updateSettings(req, res, next) {
  try {
    res.json(settingsService.updateSettings(req.body));
  } catch (err) {
    next(err);
  }
}

function reset(req, res, next) {
  try {
    settingsService.resetDemoData();
    res.json({ message: "Demo data reset successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, updateSettings, reset };
