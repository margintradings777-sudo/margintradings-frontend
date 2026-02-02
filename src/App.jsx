import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  );
}
