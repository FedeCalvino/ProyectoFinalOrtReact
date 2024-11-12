import React from 'react'
import { NavBar } from './NavBar'
import { BrowserRouter as Routes, Route } from 'react-router-dom'
import { Ventas } from './Ventas'

export const AnneDecorApp = () => {
  return (
    <>
        <NavBar/>
        <div className='container'>
            <Routes>
                <Route path="/Ventas" element={<Ventas/>}> </Route>
            </Routes>
        </div>
    </>
  )
}
