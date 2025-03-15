// src/spotify/auth.js
import { generateRandomString, generateCodeChallenge } from './authHelpers';

const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01'; // Reemplaza con tu Client ID
const REDIRECT_URI = 'http://localhost:5173/callback'; // Tu URI de redirección
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
];

export async function redirectToSpotifyAuth() {
  // Genera y guarda el code verifier
  const codeVerifier = generateRandomString(128);
  localStorage.setItem('code_verifier', codeVerifier);

  // Genera el code challenge a partir del verifier
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Construye la URL de autorización
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  // Redirige al usuario
  window.location.href = authUrl;
}
