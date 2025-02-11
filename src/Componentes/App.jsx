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
import {setRollerConfig,setRielConfig,setTradicionalConfig} from "../Features/ConfigReducer"
import {setTelasRollerFeature,setTelasTradicionalFeature} from "../Features/TelasReducer"
import { Ordenes } from '../Routes/Ordenes';
import { Lotes } from '../Routes/Lotes';
import { Toaster, toast } from "react-hot-toast";

const App = () => {
    
    const dispatch = useDispatch()

    const [token, settoken] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return storedToken ? JSON.parse(storedToken) : null;
    });

    const urlIP = import.meta.env.REACT_APP__IPSQL;
/*
    const UrlTipoConfig = "/ConfiguracionEP"
    const UrlTelas = "/TelasEP"
*/
  const UrlTipoConfig = "http://200.40.89.254:8086/Conf"
    const UrlTelas = "http://200.40.89.254:8086/Telas"

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
        try{
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
          dispatch(setTradicionalConfig(config.configuracionTradicional))
          dispatch(setRielConfig(config.configuracionRiel)); 
          dispatch(setTelasTradicionalFeature(TelasTradi));
          dispatch(setTelasRollerFeature(TelasRoller))
        }
        }catch{
            toast.error("Error al cargar las configuraciones de los articulos")
        }
      };
    
      fetchData();
    }, []);

    const login = async (usuario) => {
        try {
            //const url = `/LoginEp`;
            const url = "http://200.40.89.254:8086/auth";
            console.log(url);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            };
            console.log(usuario)
    
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            console.log(result.body);
            
            if (result.status!="OK") {
                return result
            } else {
               localStorage.setItem('token', JSON.stringify(result.body));
               settoken(result)

               window.location.reload();
            }

        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };



    return (
        <div className='AppContainer'>
            <Routes>
                <Route path='/Clientes' element={
                    <ProtectedRoute token={token} login={login}>
                        <Clientes />
                    </ProtectedRoute>
                } >
                </Route>
                <Route path='/CrearVenta' element={
                <ProtectedRoute token={token} login={login}>
                    <CrearVenta />
                </ProtectedRoute>
                } >

                </Route>
                <Route path='/Login' element={
                    <ProtectedRoute token={token} login={login}>
                        <Login/>
                    </ProtectedRoute>
                }>
                    </Route>
                <Route path='/Ventas' element={
                    <ProtectedRoute token={token} login={login}>
                        <Ventas/>
                    </ProtectedRoute>
                } >
                </Route>

                <Route path='/*' element={
                    <ProtectedRoute token={token} login={login}>
                       <CrearVenta />
                    </ProtectedRoute>} >
                    
                </Route>

                <Route path='/Instalaciones' element={
                    <ProtectedRoute token={token} login={login}>
                       <Instalaciones />
                    </ProtectedRoute>} >
                    
                </Route>

                <Route path='/Lotes' element={
                    <ProtectedRoute token={token} login={login}>
                       <Lotes/>
                    </ProtectedRoute>} >
                    
                </Route>

                <Route path='/Ordenes' element={
                    <ProtectedRoute token={token} login={login}>
                       <Ordenes/>
                    </ProtectedRoute>} >
                    
                </Route>
            </Routes>
            <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
      </div>
            </div>
    );
}

export default App;