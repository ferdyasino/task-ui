import API_BASE_URL from "../api/apiConfig";

// Helper function to handle fetch responses
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
};

export const getAllUsers = async (token) => {
  try {
    if (!token) throw new Error("No authentication token provided");
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(res);
  } catch (err) {
    throw new Error(`Failed to fetch users: ${err.message}`);
  }
};

export const createUser = async (userData, token) => {
  try {
    if (!token) throw new Error("No authentication token provided");
    console.log("Creating user:", userData); // Debug payload
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  } catch (err) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
};

export const updateUser = async (id, updates, token) => {
  try {
    if (!token) throw new Error("No authentication token provided");
    console.log("Updating user:", id, updates); // Debug payload
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  } catch (err) {
    throw new Error(`Failed to update user: ${err.message}`);
  }
};

export const deleteUser = async (id, token) => {
  try {
    if (!token) throw new Error("No authentication token provided");
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(res);
  } catch (err) {
    throw new Error(`Failed to delete user: ${err.message}`);
  }
};