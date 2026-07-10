import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppSettings } from "../types";
import { settingsApi } from "../api/settingsApi";

interface SettingsContextValue {
  settings: AppSettings;
  loading: boolean;
  toggleTheme: () => Promise<void>;
  refresh: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = { theme: "dark", appName: "Mini Git Manager", version: "1.0.0" };

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [settings.theme]);

  const toggleTheme = async () => {
    const nextTheme = settings.theme === "dark" ? "light" : "dark";
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
    await settingsApi.update({ theme: nextTheme });
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, toggleTheme, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
