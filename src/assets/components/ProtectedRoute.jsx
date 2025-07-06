import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token"); // clean expired token
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
