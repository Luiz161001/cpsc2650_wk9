import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Note from './pages/Note'
import NewNote from './pages/NewNote'


function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/note/:id' element={<Note />}/>
          <Route path='/new-note' element={<NewNote />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App