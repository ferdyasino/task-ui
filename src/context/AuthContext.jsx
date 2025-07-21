import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

// Provider
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check stored token on load
  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const { token } = parsed;
      const { exp } = JSON.parse(atob(token.split(".")[1]));

      if (Date.now() >= exp * 1000) {
        localStorage.removeItem("authToken");
      } else {
        setAuthData(parsed);
      }
    } catch (err) {
      console.error("Failed to parse stored token:", err);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login method
  const login = async ({ email, password }) => {
    const response = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Login failed: ${errText || response.status}`);
    }

    const data = await response.json();
    const authData = {
      user: data.user,
      token: data.token,
    };

    localStorage.setItem("authToken", JSON.stringify(authData));
    setAuthData(authData);
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthData(null);
    // Optionally redirect:
    // window.location.href = '/login';
  };

  const isAuthenticated = !!authData;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authData, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
