import { API_ORIGIN } from "../config";

/**
 * Resolve an image path returned by the API into a fully-qualified URL.
 */
export function resolveImageUrl(path) {
  if (!path) return "";
  if (typeof path !== "string") return "";

  const trimmed = path.trim();
  if (!trimmed) return "";

  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("data:")) return trimmed;

  const suffix = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${API_ORIGIN}${suffix}`;
}