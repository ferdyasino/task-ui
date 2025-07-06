const API_BASE = "http://localhost:4000/api"

export const getAllTasks = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");
  
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
  
  // 🛡 Ensure it’s always an array
  if (!Array.isArray(data)) {
    console.warn("Expected an array but got:", data);
    return [];
  }
  
  return data;
};


export const createTask = async (taskData) => {
  const token = localStorage.getItem("token");
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

  const data = await response.json(); 
  return data; 
};
