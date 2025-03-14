import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Playlists from './pages/Playlists';
import Artists from './pages/Artists';
import Audiobooks from './pages/Audiobooks';
import Categories from './pages/Categories';
import PageAbout from './components/PageAbout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/aboutus" element={<PageAbout />} />
      <Route path="/playlists" element={<Playlists />} />
      <Route path="/artists" element={<Artists />} />
      <Route path="/audiobooks" element={<Audiobooks />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
};

export default AppRoutes;