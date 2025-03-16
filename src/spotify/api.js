// Tu clientId y clientSecret de Spotify Developer
const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Reemplaza con tu Client ID
const CLIENT_SECRET = '6f17b1f3b4c24abdb8daf31deb5af528'; // Reemplaza con tu Client Secret

// Función para obtener el token de acceso
export const getAccessToken = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error al obtener token:', error);
    throw error;
  }
};

// Función para buscar artistas
export const searchArtists = async (token, query) => {
  try {
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.artists.items;
  } catch (error) {
    console.error('Error al buscar artistas:', error);
    throw error;
  }
};

// Función para obtener detalles de un artista
export const getArtist = async (token, artistId) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener artista:', error);
    throw error;
  }
};

// Función para obtener las canciones más populares de un artista
export const getArtistTopTracks = async (token, artistId) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error('Error al obtener canciones populares:', error);
    throw error;
  }
};

// Función para obtener artistas relacionados
export const getRelatedArtists = async (token, artistId) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.artists;
  } catch (error) {
    console.error('Error al obtener artistas relacionados:', error);
    throw error;
  }
};

// Función para buscar canciones (tracks)
export const searchTracks = async (token, query) => {
  try {
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    throw error;
  }
};

// Función para obtener detalles de una canción
export const getTrack = async (token, trackId) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener detalle de la canción:', error);
    throw error;
  }
};

// ENDPOINTS DE PODCASTS

// Función para buscar podcasts
export const searchPodcasts = async (token, query) => {
  try {
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=show&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.shows.items;
  } catch (error) {
    console.error('Error al buscar podcasts:', error);
    throw error;
  }
};

// Función para obtener detalles de un podcast
// Verificar que este archivo esté en la ruta correcta: src/spotify/api.js

// Función para obtener detalles de un podcast - CORRECCIÓN ESPECIAL
export const getPodcast = async (token, podcastId) => {
  try {
    if (!token) {
      const accessToken = await getAccessToken();
      token = accessToken;
    }
    
    console.log(`Obteniendo podcast con ID: ${podcastId} usando token: ${token.substring(0, 15)}...`);
    
    const response = await fetch(
      `https://api.spotify.com/v1/shows/${podcastId}?market=ES`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener podcast:', response.status, errorData);
      throw new Error(`Error HTTP: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Datos del podcast obtenidos:', data.name);
    return data;
  } catch (error) {
    console.error('Error al obtener detalles del podcast:', error);
    throw error;
  }
};

// Función para obtener episodios de un podcast - CORRECCIÓN ESPECIAL
export const getPodcastEpisodes = async (token, podcastId) => {
  try {
    if (!token) {
      const accessToken = await getAccessToken();
      token = accessToken;
    }
    
    console.log(`Obteniendo episodios para podcast ID: ${podcastId}`);
    
    const response = await fetch(
      `https://api.spotify.com/v1/shows/${podcastId}/episodes?market=ES&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener episodios:', response.status, errorData);
      throw new Error(`Error HTTP: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`Se obtuvieron ${data.items?.length || 0} episodios`);
    return data.items;
  } catch (error) {
    console.error('Error al obtener episodios del podcast:', error);
    throw error;
  }
};