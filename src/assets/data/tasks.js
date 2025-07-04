export const getAllTasks = async () => {
  try {
var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1MTU4NzIxMiwiZXhwIjoxNzUxNTkwODEyfQ.7cJltUsLO8R2_OudYTMdIXTsJeya3Yq2_Fj5GgdtGUk");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response =  await fetch("http://localhost:4000/api/tasks", requestOptions)
    .then(response => response.json())
    .catch((error) =>{
      throw error;
    });
    return response;
  } catch (error) {
    console.error("getAlltask", err);
  }
}