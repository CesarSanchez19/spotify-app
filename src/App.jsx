import * as React from 'react';
// import MainTienda from './components/Tienda/MainTienda/MainTienda.jsx';
import Header from './components//Header.jsx';
import AppRoutes from './AppRoutes.jsx';
// import ListaVerduras from './components/Productos/ListaVerduras.jsx';

export default function App() {
  
  return (
    <>
    {/* <MainTienda/> */}
      <Header/>

      <AppRoutes/>
    </>
);
}