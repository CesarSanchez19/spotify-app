// src/spotify/auth.js

// Importa funciones auxiliares para generar una cadena aleatoria y su correspondiente code challenge para PKCE.
import { generateRandomString, generateCodeChallenge } from './authHelpers';

// Define el Client ID obtenido de tu cuenta de Spotify Developer.
const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01';
// Define la URL a la que Spotify redirigirá después de la autenticación.
const REDIRECT_URI = 'http://localhost:5173/callback';
// Define los scopes que se solicitarán para acceder a información y funcionalidades específicas.
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-library-read",
];

/**
 * Función que redirige al usuario a la página de autenticación de Spotify.
 * Utiliza el método PKCE para mejorar la seguridad del flujo de autorización.
 */
export async function redirectToSpotifyAuth() {
  // Genera un code verifier aleatorio de 128 caracteres.
  const codeVerifier = generateRandomString(128);
  // Almacena el code verifier en localStorage para usarlo posteriormente al intercambiar el código.
  localStorage.setItem('code_verifier', codeVerifier);
  
  // Genera el code challenge basado en el code verifier, usando el algoritmo S256.
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Construye la URL de autorización con todos los parámetros requeridos:
  // - response_type=code: se solicita el código de autorización.
  // - client_id: identifica la aplicación.
  // - redirect_uri: URL a la que se redirigirá tras la autenticación.
  // - scope: permisos solicitados (espaciados y codificados).
  // - code_challenge_method: especifica el método S256.
  // - code_challenge: el challenge generado a partir del code verifier.
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  // Redirige al navegador a la URL de autenticación de Spotify.
  window.location.href = authUrl;
}
