import { Routes, Route } from "react-router";
import "./App.scss";
import Home from "./Home";
import Register from "./Register";
import Confirm from "./Confirm";
import Login from "./Login";
import Resend from "./Resend";
import Recover from "./Recover";
import Reset from "./Reset";
import MapPage from "./MapPage";
import PlantPage from "./PlantPage";

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="confirm" element={<Confirm />} />
      <Route path="login" element={<Login />} />
      <Route path="resend" element={<Resend />} />
      <Route path="recover" element={<Recover />} />
      <Route path="reset" element={<Reset />} />
      <Route path="map" element={<MapPage />} />
      <Route path="plant/:id" element={<PlantPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
