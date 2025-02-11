import React from 'react';
import { Outlet } from 'react-router-dom';
import { Login } from './Login';

export const ProtectedRoute = ({ children, token, login }) => {
    console.log(token);

if (!token) {
        return <Login loginFnct={login} />;
    }

    return children || <Outlet />;
};
