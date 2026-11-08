/**
 * Generate a collision-resistant unique ID.
 * Uses timestamp + high-resolution random + counter for safety.
 */
let _idCounter = 0;

function createId() {
  _idCounter = (_idCounter + 1) % 10000;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const counter = _idCounter.toString(36).padStart(3, '0');
  return `${timestamp}-${random}-${counter}`;
}

function truncateText(text, maxLength = 30) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTime(seconds = 0) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export {
  createId,
  truncateText,
  capitalizeFirstLetter,
  formatTime,
};
