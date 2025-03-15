// Archivo para manejar todas las llamadas a la API de Spotify

// Tu clientId y clientSecret de Spotify Developer
const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Reemplaza con tu Client ID
const CLIENT_SECRET = '6f17b1f3b4c24abdb8daf31deb5af528'; // Reemplaza con tu Client Secret

export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Reemplaza con tu Client ID

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
    client_id: CLIENT_ID,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    throw error;
  }
};


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
