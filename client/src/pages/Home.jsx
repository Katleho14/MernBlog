import {BrowserRouter, Routes, Route} from 'react-router-dom'

import React from 'react'

const Home = () => {
  return (
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/signin" element={<Signin/>} />  
        <Route path="/signup" element={<Signup/>} />
      
    </Routes>

   </BrowserRouter>
  )
}

export default Home