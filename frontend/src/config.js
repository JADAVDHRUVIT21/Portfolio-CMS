// Uses Vite env variable in production, falls back to localhost for local dev
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

// Origin = base URL WITHOUT the /api/v1 path
// Used for building full image URLs like: https://backend.com/uploads/xyz.jpg
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  API_BASE_URL.replace(/\/api\/v1\/?$/, "");