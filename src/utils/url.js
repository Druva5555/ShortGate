export function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(value) {
  // Basic normalization: trim and ensure lowercase host
  try {
    const url = new URL(value);
    url.hostname = url.hostname.toLowerCase();
    return url.toString();
  } catch {
    return value;
  }
}
