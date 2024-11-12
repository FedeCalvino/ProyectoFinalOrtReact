import { React, useState, useEffect, useNavigate } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CrearVenta } from '../Routes/CrearVenta';
import { Clientes } from '../Routes/Clientes';
import { ProtectedRoute } from '../Routes/ProtectedRoute';
import { useDispatch } from 'react-redux';

const App = () => {
    const UrlTelas = "/TipoTela";
    
    const [Loginerror,setLoginError]= useState(false)
    const dispatch = useDispatch()

    const [User, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const urlIP = import.meta.env.REACT_APP__IPSQL;


    const login = async (usuario) => {
        try {
            const url = `/Usuario/${usuario.mail}/${usuario.Pass}`;
            //const url = `http://192.168.1.130:8085/Usuario/${usuario.mail}/${usuario.Pass}`;
            console.log(url);
    
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
    
            const response = await fetch(url, requestOptions);
            const result = await response.json();
    
            console.log(result);
            
            if (result.id!=0) {
                localStorage.setItem('user', JSON.stringify(result)); // Guardar el usuario en localStorage
                setUser(result)

                setLoginError(false); // Asumiendo que la función se llama setLoginError
                window.location.reload();
            } else {
               setLoginError(true); // Asumiendo que la función se llama setLoginError
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
                    <ProtectedRoute user={User} login={login} errorLogin={Loginerror}>
                        <Clientes />
                    </ProtectedRoute>
                } >
                </Route>
                <Route path='/CrearVenta' element={
                <ProtectedRoute user={User} login={login} errorLogin={Loginerror}>
                    <CrearVenta />
                </ProtectedRoute>
                } >

                </Route>
                <Route path='/Login' element={
                    <ProtectedRoute user={User} login={login} errorLogin={Loginerror}>
                        <CrearVenta />
                    </ProtectedRoute>
                }>

                </Route>
                <Route path='/*' element={
                    <ProtectedRoute user={User} login={login} errorLogin={Loginerror}>
                       <CrearVenta />
                    </ProtectedRoute>} >
                    
                </Route>
            </Routes>
        </>
    );
}

export default App;