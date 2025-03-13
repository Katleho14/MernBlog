import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Header from './components/Header'
import Footercom from './components/Footer'
const App = () => {
  return (
    <BrowserRouter>
    <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/signin" element={<Signin/>} />  
        <Route path="/signup" element={<Signup/>} />
    
    </Routes>
 <Footercom/>
   </BrowserRouter>
  )
}

export default App
