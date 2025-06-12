export const sanitizeBlogContent = (content) => {
  if (!content) return '';
  return content
    .replace(/const API_BASE = import\.meta\.env\.VITE_API_BASE_URL;/gi, '')
    .replace(/contact API_BASE = importmeis\.envNTE_API_BASE_URL:/gi, '')
    .trim();
};