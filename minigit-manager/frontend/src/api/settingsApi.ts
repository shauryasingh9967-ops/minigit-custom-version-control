import { apiClient } from "./client";
import { AppSettings } from "../types";

export const settingsApi = {
  get: async (): Promise<AppSettings> => {
    const { data } = await apiClient.get("/settings");
    return data;
  },
  update: async (payload: Partial<AppSettings>): Promise<AppSettings> => {
    const { data } = await apiClient.put("/settings", payload);
    return data;
  },
  reset: async (): Promise<void> => {
    await apiClient.post("/settings/reset");
  },
};
