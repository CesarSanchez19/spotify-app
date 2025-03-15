// src/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Artists from "./pages/Artistas/Artists";
import ArtistDetail from "./pages/Artistas/ArtistDetail";
import PageAbout from "./components/aboutus/PageAbout";
import Login from "./components/iniciarsesion";
import Callback from "./components/Callback";
import Dashboard from "./components/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/callback" element={<Callback />} />
      {/* Se mueve Login a una ruta específica */}
      <Route path="/" element={<Login />} />
      <Route path="/aboutus" element={<PageAbout />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/artists" element={<Artists />} />
      <Route path="/artist/:id" element={<ArtistDetail />} />
      
    </Routes>
  );
};

export default AppRoutes;
