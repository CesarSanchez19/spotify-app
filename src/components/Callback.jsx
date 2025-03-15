// src/components/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extraer el 'code' de los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // Intercambiar el código por tokens
      exchangeCodeForTokens(code);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const exchangeCodeForTokens = async (code) => {
    const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Reemplaza con tu Client ID
    const REDIRECT_URI = 'http://localhost:5173/callback';
    const codeVerifier = localStorage.getItem('code_verifier');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
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
      // Guarda el access token y refresh token (si está disponible)
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      // Puedes limpiar el code verifier
      localStorage.removeItem('code_verifier');

      // Redirige a la página principal o donde necesites
      navigate("/home");
    } catch (error) {
      console.error('Error al intercambiar el código por tokens:', error);
      navigate("/");
    }
  };

  return <div>Cargando...</div>;
}

export default Callback;
