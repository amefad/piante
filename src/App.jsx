import { Routes, Route, NavLink } from "react-router";
import "./App.css";
import { Home } from "./Home";
import Login from "./Login";

function App() {
  return (
    <>
      <nav style={{ margin: 20 }}>
        <NavLink
          to={`${import.meta.env.BASE_URL}`}
          end
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
          })}
        >
          Home
        </NavLink>
        <NavLink
          to={`${import.meta.env.BASE_URL}/login`}
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
          })}
        >
          Login
        </NavLink>
      </nav>

      <Routes>
        <Route path={`${import.meta.env.BASE_URL}`} element={<Home />} />
        <Route path={`${import.meta.env.BASE_URL}/login`} element={<Login />} />
        {/* You can add more routes here */}
      </Routes>
    </>
  );
}

export default App;
