const API_BASE = "http://localhost:4000/api";

const getAuthToken = () => {
  const stored = localStorage.getItem("authToken");
  if (!stored) throw new Error("No token found. Please log in.");
  const { token } = JSON.parse(stored);
  return token;
};

export const getAllTasks = async () => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/tasks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createTask = async (taskData) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Failed to create task.");
  }

  return await response.json();
};

export const updateTask = async (id, taskData) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || "Failed to update task.");
  }

  return await response.json();
};

export const deleteTask = async (id) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error || `Failed to delete task ID ${id}`);
  }

  return true;
};
