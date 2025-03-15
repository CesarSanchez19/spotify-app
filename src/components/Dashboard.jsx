// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    
    if (!token) {
      navigate("/");
      return;
    }

    // Función para obtener datos del usuario
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        if (error.response && error.response.status === 401) {
          // Token expirado
          localStorage.removeItem("spotify_token");
          navigate("/");
        }
      }
    };

    // Función para obtener playlists
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlaylists(response.data.items);
      } catch (error) {
        console.error("Error al obtener playlists:", error);
      }
    };

    fetchUserData();
    fetchPlaylists();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("spotify_token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {user && (
        <div className="user-profile">
          <h2>¡Hola, {user.display_name}!</h2>
          {user.images && user.images.length > 0 && (
            <img src={user.images[0].url} alt="Perfil" width="100" />
          )}
          <p>Email: {user.email}</p>
        </div>
      )}

      <h2>Tus Playlists</h2>
      <div className="playlists">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist-item">
            {playlist.images && playlist.images.length > 0 && (
              <img src={playlist.images[0].url} alt={playlist.name} width="100" />
            )}
            <h3>{playlist.name}</h3>
            <p>{playlist.tracks.total} canciones</p>
          </div>
        ))}
      </div>

      <button onClick={logout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Dashboard;