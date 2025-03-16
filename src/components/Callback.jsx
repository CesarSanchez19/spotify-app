// src/components/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate(); // Hook para redirigir a otras rutas

  useEffect(() => {
    // Extraer el 'code' de los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // Obtener el valor del parámetro 'code'

    if (code) {
      // Si existe el código, proceder a intercambiarlo por tokens
      exchangeCodeForTokens(code);
    } else {
      // Si no existe el código, redirigir al inicio de la aplicación
      navigate("/"); 
    }
  });

  const exchangeCodeForTokens = async (code) => {
    const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Client ID de la aplicación en Spotify
    const REDIRECT_URI = 'http://localhost:5173/callback'; // URI de redirección, debe coincidir con la configurada en Spotify
    const codeVerifier = localStorage.getItem('code_verifier'); // Obtener el code_verifier desde localStorage

    // Crear el cuerpo de la solicitud POST con los parámetros necesarios
    const body = new URLSearchParams({
      grant_type: 'authorization_code', // Tipo de grant utilizado (código de autorización)
      code: code, // Código obtenido de la URL
      redirect_uri: REDIRECT_URI, // URI de redirección (debe ser la misma que en la configuración de Spotify)
      client_id: CLIENT_ID, // ID del cliente (registrado en Spotify)
      code_verifier: codeVerifier, // Verificador de código (almacenado previamente)
    });

    try {
      // Realizar la solicitud POST a la API de Spotify para obtener los tokens
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', // Método de solicitud
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Tipo de contenido de la solicitud
        },
        body: body.toString(), // Cuerpo de la solicitud convertido a string
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`); // Lanza un error si la respuesta no es OK
      }

      const data = await response.json(); // Convertir la respuesta a formato JSON
      // Guarda el access token y refresh token (si está disponible) en localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      // Limpiar el code verifier de localStorage (ya no es necesario)
      localStorage.removeItem('code_verifier');

      // Redirigir a la página principal o donde sea necesario
      navigate("/"); 
    } catch (error) {
      console.error('Error al intercambiar el código por tokens:', error); // Log de error en caso de fallo
      navigate("/login"); // Si hay un error, redirigir a la página de login
    }
  };

  return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se procesan los tokens
}

export default Callback;
