import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Tasks from "./pages/task/Tasks";
import Register from "./pages/register/Register";
import Home from "./Home";
import Login from "./pages/login/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
