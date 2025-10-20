// frontend/js/utils/offlineBanner.js

import { getToken } from '../services/state/sessionStore.js';
import { isLocalToken } from '../services/auth/localAuth.js';

let bannerElement = null;

export function showOfflineBanner() {
  if (bannerElement) return;
  
  bannerElement = document.createElement('div');
  bannerElement.id = 'offlineModeBanner';
  bannerElement.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      padding: 10px 20px;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    ">
      <span style="font-size: 1.2rem;">⚠️</span>
      <span>OFFLINE MODE - Backend unavailable. Some features may not work.</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        margin-left: auto;
      ">Dismiss</button>
    </div>
  `;
  
  document.body.insertBefore(bannerElement, document.body.firstChild);
  
  const main = document.getElementById('content');
  if (main) {
    main.style.paddingTop = '50px';
  }
}

export function hideOfflineBanner() {
  if (bannerElement) {
    bannerElement.remove();
    bannerElement = null;
    
    const main = document.getElementById('content');
    if (main) {
      main.style.paddingTop = '';
    }
  }
}

export function checkAndShowOfflineBanner() {
  const token = getToken();
  if (token && isLocalToken(token)) {
    showOfflineBanner();
  } else {
    hideOfflineBanner();
  }
}
