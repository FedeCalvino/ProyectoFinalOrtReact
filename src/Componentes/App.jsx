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
import {setRollerConfig,setRielConfig} from "../Features/ConfigReducer"
import {setTelasRollerFeature,setTelasTradicionalFeature} from "../Features/TelasReducer"
import { Ordenes } from '../Routes/Ordenes';
import { Lotes } from '../Routes/Lotes';

const App = () => {
    
    const dispatch = useDispatch()

    const [User, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const urlIP = import.meta.env.REACT_APP__IPSQL;

    const UrlTipoConfig = "/ConfiguracionEP"
    const UrlTelas = "/TelasEP"

    const fetchRollerConf = async () => {
      try {
        const res = await fetch(UrlTipoConfig);
        const data = await res.json();
        return data.body; 
      } catch (error) {
        console.error("Error fetching roller configuration:", error);
        return null; 
      }
    };
    const fetchTelas = async()=>{
        try {
            const res = await fetch(UrlTelas);
            const data = await res.json();
            return data.body; 
        } catch (error) {
            console.error("Error fetching roller configuration:", error);
            return null; 
        }
    }
    useEffect(() => {
      const fetchData = async () => {
        const config = await fetchRollerConf();
        const telas = await fetchTelas();
        console.log("telas",telas)
        const TelasRoller = telas.filter(tela=>tela.tipo===1)
        console.log("TelasRoller",TelasRoller)
        const TelasTradi = telas.filter(tela=>tela.tipo===2)
        console.log("TelasTradi",TelasTradi)
        if (config) {
          console.log("config",config)

          dispatch(setRollerConfig(config.configuracionRoller)); 
          dispatch(setRielConfig(config.configuracionRiel)); 
          dispatch(setTelasTradicionalFeature(TelasTradi));
          dispatch(setTelasRollerFeature(TelasRoller))
        }
      };
    
      fetchData();
    }, []);

    const login = async (usuario) => {
        try {
            const url = `/LoginEp`;
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

                <Route path='/Lotes' element={
                    <ProtectedRoute user={User} login={login}>
                       <Lotes/>
                    </ProtectedRoute>} >
                    
                </Route>

                <Route path='/Ordenes' element={
                    <ProtectedRoute user={User} login={login}>
                       <Ordenes/>
                    </ProtectedRoute>} >
                    
                </Route>
            </Routes>
        </>
    );
}

export default App;