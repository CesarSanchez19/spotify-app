// src/spotify/auth.js
import { generateRandomString, generateCodeChallenge } from './authHelpers';

const CLIENT_ID = '457c38fa572f4dd4b07dabf46852ff01';
const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-library-read",
];

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128);
  localStorage.setItem('code_verifier', codeVerifier);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  window.location.href = authUrl;
}
