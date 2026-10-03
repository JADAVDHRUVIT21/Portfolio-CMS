// Uses Vite env variable in production, falls back to localhost for local dev
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://portfolio-cms-3i4e.onrender.com/api/v1";