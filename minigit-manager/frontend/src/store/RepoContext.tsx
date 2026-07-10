import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Repository } from "../types";
import { repoApi } from "../api/repoApi";

interface RepoContextValue {
  repos: Repository[];
  activeRepoId: string | null;
  activeRepo: Repository | null;
  loading: boolean;
  setActiveRepoId: (id: string | null) => void;
  refreshRepos: () => Promise<void>;
}

const STORAGE_KEY = "minigit:activeRepoId";

const RepoContext = createContext<RepoContextValue | undefined>(undefined);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [activeRepoId, setActiveRepoIdState] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);

  const setActiveRepoId = useCallback((id: string | null) => {
    setActiveRepoIdState(id);
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshRepos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repoApi.list();
      setRepos(data);
      setActiveRepoIdState((current) => {
        if (current && data.some((r) => r.id === current)) return current;
        const fallback = data[0]?.id || null;
        if (fallback) localStorage.setItem(STORAGE_KEY, fallback);
        else localStorage.removeItem(STORAGE_KEY);
        return fallback;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRepos();
  }, [refreshRepos]);

  const activeRepo = repos.find((r) => r.id === activeRepoId) || null;

  return (
    <RepoContext.Provider value={{ repos, activeRepoId, activeRepo, loading, setActiveRepoId, refreshRepos }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepoContext() {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error("useRepoContext must be used within a RepoProvider");
  return ctx;
}
