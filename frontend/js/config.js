// frontend/js/config.js
// Configuration for different environments
// Note: Production URLs and endpoints have been redacted for security purposes.
// Configure your own endpoints when deploying.

export const config = {
  API: window.API || 
               (typeof process !== 'undefined' && process.env?.API) ||
               null,
  
  DEBUG: window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.search.includes('debug=true'),
  
  get IS_CROSS_ORIGIN() {
    return this.API !== window.location.origin;
  },
  
  get ENVIRONMENT() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'development';
    }
    if (window.location.hostname.includes('pages.dev') || window.location.hostname.includes('cloudflare')) {
      return 'production';
    }
    return 'unknown';
  }
};

export function getApiUrl() {
  return config.API + '/api';
}

export function getApiBase() {
  return config.API;
}

console.log('[Config] Environment:', config.ENVIRONMENT);
console.log('[Config] Backend URL:', config.API);
console.log('[Config] API URL:', getApiUrl());
console.log('[Config] Frontend Origin:', window.location.origin);
console.log('[Config] Cross-origin:', config.IS_CROSS_ORIGIN);
console.log('[Config] Debug mode:', config.DEBUG);

export default config;
