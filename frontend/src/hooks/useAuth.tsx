/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import type { IUser } from "../interfaces/IUser";
import type { AxiosError } from "axios";
import { Status, ERROR_RESPONSES } from "../constants/status";

interface AuthState {
  user: IUser | null;
  email: string | null;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedUser) {
      return {
        user: storedUser,
        email: storedUser.email,
        error: null,
      };
    }

    return {
      user: null,
      email: null,
      error: null,
    };
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      const { user } = response.data;
      setAuthState({ user, email, error: null });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      const axiosError = error as AxiosError<{ status: string }>;
      const status = axiosError.response?.data?.status || Status.ERROR;
      const errorMessage =
        ERROR_RESPONSES[status]?.message || "Error desconocido";

      setAuthState({
        user: null,
        email: null,
        error: errorMessage,
      });
    }
  };

  const logout = () => {
    setAuthState({ user: null, email: null, error: null });
    localStorage.removeItem("user"); // Elimina el email del almacenamiento local
  };

  const isAuthenticated = () => {
    return !!authState.email;
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
