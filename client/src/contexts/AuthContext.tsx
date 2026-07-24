import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
type User = {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
};
const AuthContext = createContext<AuthContextType | null>(null);
const API_URL = import.meta.env.VITE_API_URL;
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, {
  credentials: "include",
})
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
    if (data.authenticated) {
        setUser(data.user);
    } else {
        setUser(null);
    }
})
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuth must be used inside AuthProvider");

  return context;
}