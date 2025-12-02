"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { verificarSesionBackend, User } from "@/app/redux/services/auth/registro";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearSession = () => {
    localStorage.removeItem("servineo_token");
    localStorage.removeItem("servineo_user");
    setUser(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("servineo_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const token = localStorage.getItem("servineo_token");
        const sessionType = localStorage.getItem("servineo_session_type");

        // Si no hay token, no hay sesión
        if (!token) {
          setLoading(false);
          return;
        }

        // 🔹 Caso 1: sesión de Google → verificar contra /google/verify
        if (sessionType === "google") {
          const data = await verificarSesionBackend(token);

          if (data.valid && data.user) {
            setUser((prev) => {
              const newUser = { ...prev, ...data.user };
              localStorage.setItem("servineo_user", JSON.stringify(newUser));
              return newUser;
            });
          } else {
            localStorage.removeItem("servineo_token");
            localStorage.removeItem("servineo_user");
            localStorage.removeItem("servineo_session_type");
            setUser(null);
          }
        }

        // 🔹 Caso 2: sesión manual → por ahora confiamos en localStorage
        if (sessionType === "manual") {
          // Si quieres, aquí podrías llamar a otro endpoint:
          // /api/controlC/auth/verify o similar
          // Por ahora solo dejamos al usuario logueado si el token existe.
        }
      } catch (e) {
        console.error("Error comprobando la sesión:", e);
        localStorage.removeItem("servineo_token");
        localStorage.removeItem("servineo_user");
        localStorage.removeItem("servineo_session_type");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);


  useEffect(() => {
    if (user) {
      localStorage.setItem("servineo_user", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("servineo_token");
    localStorage.removeItem("servineo_user");
    localStorage.removeItem("servineo_session_type");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
