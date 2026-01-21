import React from 'react'
import {HashRouter,Routes, Route} from "react-router"
import Home from "./Home.jsx"
import Profile from "./Profile.jsx"

function App() {
  return (
 <HashRouter>
  <Routes>
    <Route exact path="" element={<Home/>}/>
    <Route path="/profile" element={<Profile/>}/>
  </Routes>
 </HashRouter>
  )
}

export default App
