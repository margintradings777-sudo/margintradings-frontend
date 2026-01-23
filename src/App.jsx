import React from 'react'
import { HashRouter, Routes, Route } from "react-router-dom"
import Home from "./Home.jsx"
import Profile from "./Profile.jsx"

function App() {
  return (
    <HashRouter>
      <Routes>
      
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  )
}

export default App
