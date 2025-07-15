import { Routes, Route } from "react-router";
import "./App.scss";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path={`${import.meta.env.BASE_URL}`} element={<Home />} />
          <Route
            path={`${import.meta.env.BASE_URL}/login`}
            element={<Login />}
          />
        </Routes>
      </main>
    </>
  );
}
