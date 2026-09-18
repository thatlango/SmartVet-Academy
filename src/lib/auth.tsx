import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export type AcademyUser = {
  id: string;
  coreUserId: string;
  displayName: string | null;
  email: string | null;
};

type Value = {
  user: AcademyUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AcademyUser>;
  signUp: (fullName: string, email: string, password: string) => Promise<AcademyUser>;
  signOut: () => Promise<void>;
  refresh: () => Promise<AcademyUser | null>;
};

const Context = createContext<Value>({
  user: null,
  loading: true,
  signIn: async () => { throw new Error("Auth provider unavailable."); },
  signUp: async () => { throw new Error("Auth provider unavailable."); },
  signOut: async () => {},
  refresh: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AcademyUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const next = await api<AcademyUser | null>("/api/auth/session");
      setUser(next);
      return next;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  const value = useMemo<Value>(() => ({
    user,
    loading,
    refresh,
    signIn: async (email, password) => {
      const next = await api<AcademyUser>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(next);
      return next;
    },
    signUp: async (fullName, email, password) => {
      const next = await api<AcademyUser>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });
      setUser(next);
      return next;
    },
    signOut: async () => {
      try { await api<{ revoked: boolean }>("/api/auth/logout", { method: "POST", body: "{}" }); }
      finally { setUser(null); }
    },
  }), [user, loading]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useAuth = () => useContext(Context);
