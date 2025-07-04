import { Link } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function Home() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TaskManager v1</h1>
      <p className="read-the-docs"></p>
      <p>
        <Link to="/tasks">Go to My Tasks</Link>
      </p>
    </>
  );
}
