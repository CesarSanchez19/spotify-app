// CLIENT_ID y CLIENT_SECRET obtenidos de tu cuenta Spotify Developer.
// Estos valores son necesarios para autenticar la aplicación con la API de Spotify.
const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Reemplaza con tu Client ID
const CLIENT_SECRET = '6f17b1f3b4c24abdb8daf31deb5af528'; // Reemplaza con tu Client Secret

// ====================================================
// Función para obtener el token de acceso de Spotify.
// Se utiliza el flujo de "client credentials" para obtener un token sin interacción del usuario.
// ====================================================
export const getAccessToken = async () => {
  try {
    // Realiza una petición POST al endpoint de token de Spotify.
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        // Define el tipo de contenido como URL encoded.
        'Content-Type': 'application/x-www-form-urlencoded',
        // Se envía la autorización en formato Basic, codificando en base64 la concatenación del CLIENT_ID y CLIENT_SECRET.
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      // El body indica el tipo de grant que se solicita.
      body: 'grant_type=client_credentials'
    });

    // Si la respuesta no es exitosa, se lanza un error con el status HTTP.
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Se parsea la respuesta en formato JSON y se retorna el token de acceso.
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    // Se imprime en consola el error y se relanza para que lo maneje el llamador.
    console.error('Error al obtener token:', error);
    throw error;
  }
};

// ====================================================
// Función para buscar artistas usando la API de Spotify.
// Realiza una búsqueda de artistas basada en el término proporcionado.
// ====================================================
export const searchArtists = async (token, query) => {
  try {
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }

    // Realiza la petición GET al endpoint de búsqueda de Spotify para el tipo "artist".
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=20`,
      {
        headers: {
          // Se utiliza el token de acceso en el encabezado Authorization.
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Se parsea la respuesta JSON y se retornan los ítems de artistas.
    const data = await response.json();
    return data.artists.items;
  } catch (error) {
    console.error('Error al buscar artistas:', error);
    throw error;
  }
};

// ====================================================
// Función para obtener detalles de un artista.
// Consulta el endpoint de Spotify para obtener la información detallada de un artista específico.
// ====================================================
export const getArtist = async (token, artistId) => {
  try {
    // Realiza una petición GET al endpoint del artista con su ID.
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

    // Se retorna la información del artista en formato JSON.
    return await response.json();
  } catch (error) {
    console.error('Error al obtener artista:', error);
    throw error;
  }
};

// ====================================================
// Función para obtener las canciones más populares de un artista.
// Consulta el endpoint de "top-tracks" del artista para el mercado especificado (en este caso, España).
// ====================================================
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

    // Se parsea la respuesta y se retorna el array de pistas.
    const data = await response.json();
    return data.tracks;
  } catch (error) {
    console.error('Error al obtener canciones populares:', error);
    throw error;
  }
};

// ====================================================
// Función para obtener artistas relacionados.
// Consulta el endpoint de artistas relacionados para un artista específico.
// ====================================================
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

// ====================================================
// Función para buscar canciones (tracks) en Spotify.
// Realiza una búsqueda de pistas basándose en el término ingresado.
// ====================================================
export const searchTracks = async (token, query) => {
  try {
    if (!token) {
      throw new Error('No hay token de acceso disponible');
    }

    // Se realiza la petición GET para buscar pistas, limitando el resultado a 20 elementos.
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

    // Se parsea la respuesta JSON y se retornan los ítems de pistas.
    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error al buscar canciones:', error);
    throw error;
  }
};

// ====================================================
// Función para obtener detalles de una canción.
// Consulta el endpoint de Spotify para obtener información detallada de una pista específica.
// ====================================================
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

    // Se retorna la información de la pista en formato JSON.
    return await response.json();
  } catch (error) {
    console.error('Error al obtener detalle de la canción:', error);
    throw error;
  }
};

// ====================================================
// ENDPOINTS DE PODCASTS
// ====================================================

// ====================================================
// Función para buscar podcasts en Spotify.
// Realiza una búsqueda para el tipo "show" y limita los resultados a 10 elementos.
// ====================================================
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

    // Se parsea la respuesta y se retornan los ítems de podcasts.
    const data = await response.json();
    return data.shows.items;
  } catch (error) {
    console.error('Error al buscar podcasts:', error);
    throw error;
  }
};

// ====================================================
// Función para obtener detalles de un podcast.
// Consulta el endpoint para obtener información detallada de un podcast, considerando el mercado (ES).
// ====================================================
export const getPodcast = async (token, podcastId) => {
  try {
    // Si no se pasa un token, se solicita uno nuevo.
    if (!token) {
      const accessToken = await getAccessToken();
      token = accessToken;
    }
    
    // Muestra en consola parte del token y el ID del podcast (útil para debugging)
    console.log(`Obteniendo podcast con ID: ${podcastId} usando token: ${token.substring(0, 15)}...`);
    
    const response = await fetch(
      `https://api.spotify.com/v1/shows/${podcastId}?market=ES`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Si la respuesta no es exitosa, se captura y muestra el error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al obtener podcast:', response.status, errorData);
      throw new Error(`Error HTTP: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    // Se parsea y retorna la información del podcast.
    const data = await response.json();
    console.log('Datos del podcast obtenidos:', data.name);
    return data;
  } catch (error) {
    console.error('Error al obtener detalles del podcast:', error);
    throw error;
  }
};

// ====================================================
// Función para obtener episodios de un podcast.
// Realiza una petición al endpoint de episodios de un podcast, considerando el mercado (ES) y limitando a 50 episodios.
// ====================================================
export const getPodcastEpisodes = async (token, podcastId) => {
  try {
    // Si no se tiene token, se solicita uno.
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

    // Se parsea y retorna la lista de episodios.
    const data = await response.json();
    console.log(`Se obtuvieron ${data.items?.length || 0} episodios`);
    return data.items;
  } catch (error) {
    console.error('Error al obtener episodios del podcast:', error);
    throw error;
  }
};
