import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { Login } from './Login'

export const ProtectedRoute = ({children,user,login,errorLogin}) => {
    console.log(user)

   /* if(!user){
        return <Login loginFnct={login} error={errorLogin}/>
     }*/
    return (
        children ? children : <Outlet/>
    )
}
