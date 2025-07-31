import { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from "../api/apiConfig"; 

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

let externalLogout = () => {}; // globally accessible logout

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    externalLogout = logout;

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

  const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = "Login failed. Please try again.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If not JSON, use raw text
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const authData = { user: data.user, token: data.token };

    localStorage.setItem("authToken", JSON.stringify(authData));
    setAuthData(authData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthData(null);
  };

  const isAuthenticated = !!authData;
  const user = authData?.user;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authData, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const getExternalLogout = () => externalLogout;
