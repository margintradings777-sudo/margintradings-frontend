import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Profile from "./Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
