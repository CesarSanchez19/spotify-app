import React from "react";
import { Routes, Route } from "react-router-dom";
import Artists from "./pages/Artistas/Artists";
import ArtistDetail from "./pages/Artistas/ArtistDetail";
import PageAbout from "./components/aboutus/PageAbout";
import Login from "./components/iniciarsesion";
import Callback from "./components/Callback";
import SearchTracks from "./pages/Tracks/SearchTracks";
import TrackDetail from "./pages/Tracks/TrackDetail";
import SearchPodcasts from "./pages/Podcasts/SearchPodcasts";
import PodcastDetails from './pages/Podcasts/PodcastDetails';
import Home from "./pages/home/Home";
import NotFound from "./components/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/callback" element={<Callback />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/aboutus" element={<PageAbout />} />
      
      {/* Nested routes for Artists */}
      <Route path="/artists">
        <Route index element={<Artists />} />
        <Route path=":id" element={<ArtistDetail />} />
      </Route>
      
      {/* Nested routes for Tracks */}
      <Route path="/tracks">
        <Route index element={<SearchTracks />} />
        <Route path=":id" element={<TrackDetail />} />
      </Route>
      
      {/* Nested routes for Podcasts */}
      <Route path="/podcasts">
        <Route index element={<SearchPodcasts />} />
        <Route path=":id" element={<PodcastDetails />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;