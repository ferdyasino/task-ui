// api/taskService.js
import fetchWithAuth from "./apiClient";

export const getAllTasks = () => fetchWithAuth("/tasks", { method: "GET" });

export const createTask = (taskData) =>
  fetchWithAuth("/tasks", {
    method: "POST",
    body: taskData instanceof FormData ? taskData : JSON.stringify(taskData),
  });

export const updateTask = (id, taskData) =>
  fetchWithAuth(`/tasks/${id}`, {
    method: "PUT",
    body: taskData instanceof FormData ? taskData : JSON.stringify(taskData),
  });

export const deleteTask = async (id) => {
  await fetchWithAuth(`/tasks/${id}`, { method: "DELETE" });
  return true;
};

export const deleteTaskFile = async (taskId, fileId) => {
  await fetchWithAuth(`/tasks/${taskId}/files/${fileId}`, { method: "DELETE" });
  return true;
};
