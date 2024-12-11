import { React, useState, useEffect, useNavigate } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CrearVenta } from '../Routes/CrearVenta';
import { Clientes } from '../Routes/Clientes';
import { ProtectedRoute } from '../Routes/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { Ventas } from '../Routes/Ventas';
import "../Routes/Css/App.css"
import { Login } from '../Routes/Login';
import { Instalaciones } from './Instalaciones';
const App = () => {
    
    const dispatch = useDispatch()

    const [User, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const urlIP = import.meta.env.REACT_APP__IPSQL;


    const login = async (usuario) => {
        try {
            const url = `http://localhost:8083/auth/login`;
            console.log(url);
    
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            };
            console.log(usuario)
    
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            console.log(result);
            
            if (result.status!="OK") {
                return result
            } else {
               localStorage.setItem('user', JSON.stringify(result));
               setUser(result)

               setLoginError(false);
               window.location.reload();
            }

        } catch (error) {
            console.log('Error:', error);
            setLoginError(true); 
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };



    return (
        <>
            <Routes>
                <Route path='/Clientes' element={
                    <ProtectedRoute user={User} login={login}>
                        <Clientes />
                    </ProtectedRoute>
                } >
                </Route>
                <Route path='/CrearVenta' element={
                <ProtectedRoute user={User} login={login}>
                    <CrearVenta />
                </ProtectedRoute>
                } >

                </Route>
                <Route path='/Login' element={
                    <ProtectedRoute user={User} login={login}>
                        <Login/>
                    </ProtectedRoute>
                }>
                    </Route>
                <Route path='/Ventas' element={
                    <ProtectedRoute user={User} login={login}>
                        <Ventas/>
                    </ProtectedRoute>
                } >
                </Route>

                <Route path='/*' element={
                    <ProtectedRoute user={User} login={login}>
                       <CrearVenta />
                    </ProtectedRoute>} >
                    
                </Route>

                <Route path='/Instalaciones' element={
                    <ProtectedRoute user={User} login={login}>
                       <Instalaciones />
                    </ProtectedRoute>} >
                    
                </Route>

            </Routes>
        </>
    );
}

export default App;