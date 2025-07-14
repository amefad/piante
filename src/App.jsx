import { Routes, Route, Link, NavLink } from "react-router";
import "./App.css";
import { Home } from "./Home";
import Login from "./Login";

function App() {
  return (
    <>
      <nav style={{ margin: 20 }}>
        <NavLink
          to="./"
          relative="path"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
          })}
        >
          Home
        </NavLink>
        <NavLink
          to="./login"
          relative="path"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
          })}
        >
          Login
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* You can add more routes here */}
      </Routes>
    </>
  );
}

export default App;
