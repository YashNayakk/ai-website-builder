import React from 'react'
import {Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MyProjects from './pages/MyProjects';
import Community from './pages/Community';
import Preview from './pages/Preview';
import Pricing from './pages/Pricing';
import Projects from './pages/Projects';
import View from './pages/View';
import Navbar from './components/Navbar';


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/community" element={<Community />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/view/:projectId" element={<View />} />
      </Routes>
    </div>
  )
}

export default App