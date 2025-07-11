import { Routes, Route, Link } from "react-router";
import "./App.css";
import { Home } from "./Home";
import Login from "./Login";

function App() {
  return (
    <>
      <nav style={{ margin: 20 }}>
        <Link to="/" style={{ marginRight: 10 }}>
          Home
        </Link>
        <Link to="/login">Login</Link>
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
