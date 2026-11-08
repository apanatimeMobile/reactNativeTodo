/**
 * RESPONSIBILITY: Define stable app identity and existing storage key contracts.
 * FLOW: App composition and feature adapters consume this shared host contract.
 */

const APP_CONFIG = {
  APP_NAME: 'Tasklume',
  APP_TAGLINE: 'Plan Smart. Focus Better.',

  STORAGE_KEYS: {
    AUTH_USER: '@todomaster/auth_user',
    TODOS: '@todomaster/todos',
    THEME: '@todomaster/theme',
    VOICE_MEMOS: '@todomaster/voice_memos',
  },
};

export default APP_CONFIG;