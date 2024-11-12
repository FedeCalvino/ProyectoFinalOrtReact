import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './Componentes/App';
import { NavBar } from './Componentes/NavBar';
import { store }  from "./Routes/Store";
import { Provider } from 'react-redux';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
          <NavBar/>
          <App />
    </BrowserRouter>
  </Provider>
);
