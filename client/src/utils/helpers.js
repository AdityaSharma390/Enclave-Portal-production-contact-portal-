/**
 * Get initials from a full name.
 * e.g., "John Doe" -> "JD"
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format timestamp to friendly local date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get a deterministic aesthetic HSL color based on string hash.
 * This guarantees same names always receive the same color backgrounds.
 */
export const getAvatarColor = (name) => {
  if (!name) return 'hsl(215, 60%, 50%)';
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use HSL for soft pastel-like but saturated modern palettes
  const h = Math.abs(hash % 360);
  const s = 65; // Saturation %
  const l = 45; // Lightness %
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Resolves local fallback image URLs to point directly to the backend URL on production
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const backendUrl = import.meta.env.VITE_API_URL || '';
  const originUrl = backendUrl.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl;
  return `${originUrl}${imagePath}`;
};
