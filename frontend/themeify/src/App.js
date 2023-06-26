import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import Login from './Login';
import About from './About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Home />} />
        <Route path="/about.html" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

// Use next.js,