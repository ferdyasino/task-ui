/**
 * Get all tasks from api
 * @returns
 */
export const getAllTasks = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await fetch("http://localhost:4000/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      if (response.status === 404) {
        return []; 
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error.message);
    throw error;
  }
};
