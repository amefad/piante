import { Routes, Route } from "react-router";
import "./App.scss";
import Home from "./Home";
import Register from "./Register";
import Confirm from "./Confirm";
import Login from "./Login";
import MapPage from "./MapPage";
import Page from "./Page";

export default function App() {
  return (
    <Routes>
      <Route path={`${import.meta.env.BASE_URL}`} element={<Home />} />
      <Route path={`${import.meta.env.BASE_URL}/register`} element={<Register />} />
      <Route path={`${import.meta.env.BASE_URL}/confirm`} element={<Confirm />} />
      <Route path={`${import.meta.env.BASE_URL}/login`} element={<Login />} />
      <Route path={`${import.meta.env.BASE_URL}/map`} element={<MapPage />} />
      <Route path="*" element={<Page title="Niente qui" />} />
    </Routes>
  );
}
