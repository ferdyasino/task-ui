import API_BASE from "./apiConfig";
import { getExternalLogout } from "./../context/AuthContext";

const getAuthToken = () => {
  const stored = localStorage.getItem("authToken");
  if (!stored) throw new Error("No token found. Please log in.");
  return JSON.parse(stored).token;
};

const handleUnauthorized = (response) => {
  if (response.status === 401) {
    getExternalLogout()();
    throw new Error("Unauthorized. Please log in again.");
  }
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  // Detect FormData and set headers accordingly
  const isFormData = options.body instanceof FormData;

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    handleUnauthorized(response);
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error || `Error ${response.status}`);
  }

  return response.json();
};

export default fetchWithAuth;
