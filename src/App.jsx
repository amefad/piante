import { Routes, Route } from "react-router";
import "./App.scss";
import Home from "./Home";
import Login from "./Login";
import MapPage from "./MapPage";

export default function App() {
  return (
    <Routes>
      <Route path={`${import.meta.env.BASE_URL}`} element={<Home />} />
      <Route path={`${import.meta.env.BASE_URL}/login`} element={<Login />} />
      <Route path={`${import.meta.env.BASE_URL}/map`} element={<MapPage />} />
    </Routes>
  );
}
