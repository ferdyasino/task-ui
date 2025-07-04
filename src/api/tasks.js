/**
 * Get all tasks from api
 * @returns
 */
const token = localStorage.getItem('token');
console.log("token",token);
export const getAllTasks = async () => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch("http://localhost:4000/api/tasks", requestOptions)
      .then(response => response.json())
      .catch((error) => {
          throw error;
        });
    return response;
  } catch (err) {
    console.error("getAllTasks", err);
  }
};
