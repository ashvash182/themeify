import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import Login from './Login';
import MiscInfo from './MiscInfo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about.html" element={<MiscInfo page='about'/>} />
        <Route path="/privacy.html" element={<MiscInfo page='privacy'/>} />
      </Routes>
    </Router>
  );
}

export default App;

// Use next.js,