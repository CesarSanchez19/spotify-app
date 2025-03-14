// src/config.js
export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = "457c38fa572f4dd4b07dabf46852ff01"; // Reemplaza con tu Client ID de Spotify
export const redirectUri = "http://localhost:3000/";
export const scopes = [
  "user-read-private",
  "user-read-email",
  // agrega otros scopes si los necesitas
];
