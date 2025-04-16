import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  // 🔄 On initial load, check for stored username
  useEffect(() => {
    const name = localStorage.getItem("userName"); // ✅ updated key
    if (name) {
      setIsAuthenticated(true);
      setUserName(name);
    }
  }, []);

  // ✅ Login stores userName
  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    localStorage.setItem("userName", name); // ✅ updated key
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    localStorage.clear(); // You could also clear specific keys if needed
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
