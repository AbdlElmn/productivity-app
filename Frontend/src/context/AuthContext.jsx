import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiRequest } from "../lib/api";

const STORAGE_KEY = "elmn-auth";
const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function readStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!session?.token) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!session?.token) {
      return;
    }

    const decoded = decodeJwt(session.token);
    if (!decoded?.exp) {
      logout();
      return;
    }

    const expiresAtMs = decoded.exp * 1000;
    const remainingMs = expiresAtMs - Date.now();

    if (remainingMs <= 0) {
      logout();
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      logout();
    }, remainingMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [session?.token]);

  useEffect(() => {
    const hydrateUser = async () => {
      if (!session?.token) {
        setLoading(false);
        return;
      }

      try {
        const user = await apiRequest("/auth/me", { token: session.token });
        setSession((current) => (current ? { ...current, user } : current));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const login = async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    });
    setSession(response);
    return response;
  };

  const register = async (payload) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: payload,
    });
  };

  const verifyEmail = async (payload) => {
    return apiRequest("/auth/verify-email", {
      method: "POST",
      body: payload,
    });
  };

  const resendVerificationCode = async (email) => {
    return apiRequest("/auth/resend-code", {
      method: "POST",
      body: { email },
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const value = {
    token: session?.token ?? null,
    user: session?.user ?? null,
    loading,
    isAuthenticated: Boolean(session?.token && session?.user),
    isAdmin: session?.user?.role === "ADMIN",
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
