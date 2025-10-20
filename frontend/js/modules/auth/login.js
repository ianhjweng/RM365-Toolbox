// frontend/js/modules/auth/login.js
import { login, me } from '../../services/api/authApi.js';
import { setToken, clearToken, isAuthed, getToken } from '../../services/state/sessionStore.js';
import { setAllowedTabs, clearUser } from '../../services/state/userStore.js';
import { navigate } from '../../router.js';
import { setupTabsForUser, getDefaultAllowedPath } from '../../utils/tabs.js';
import { loginLocal, validateLocalToken, isLocalToken } from '../../services/auth/localAuth.js';

function $(sel) { return document.querySelector(sel); }

async function doLogin() {
  console.log('[LOGIN] doLogin called');
  const status = $('#loginStatus');
  const username = $('#loginUsername')?.value?.trim();
  const password = $('#loginPassword')?.value || '';
  
  console.log('[LOGIN] Username:', username, 'Password length:', password.length);
  
  if (!username || !password) {
    status.textContent = 'Please enter both username and password.';
    return;
  }
  $('#loginBtn')?.setAttribute('disabled', 'true');
  status.textContent = 'Signing in…';

  try {
    console.log('[LOGIN] Calling login API...');
    const { access_token, allowed_tabs } = await login({ username, password });
    console.log('[LOGIN] Login successful, token:', access_token?.substring(0, 20) + '...', 'tabs:', allowed_tabs);
    
    setToken(access_token);
    setAllowedTabs(allowed_tabs);
    status.textContent = 'Login successful! Redirecting...';
    
    // Setup tabs immediately after successful login
    try { 
      setupTabsForUser(); 
      console.log('[LOGIN] Tabs setup completed');
    } catch (e) {
      console.warn('[LOGIN] Tab setup failed:', e);
    }
    
    const dest = getDefaultAllowedPath(allowed_tabs);
    console.log('[LOGIN] Navigating to:', dest);
    
    setTimeout(async () => {
      if (dest && dest !== '/login') {
        await navigate(dest, true);
      } else {
        console.warn('[LOGIN] No valid destination path found, staying on login');
        status.textContent = 'Login successful but no accessible pages found.';
      }
    }, 500);
    
  } catch (e) {
    console.error('[LOGIN] Login failed:', e);
    
    console.log('[LOGIN] Backend unavailable, attempting local authentication...');
    status.textContent = 'Backend offline, trying local auth...';
    
    try {
      const { access_token, allowed_tabs } = loginLocal(username, password);
      console.log('[LOGIN] Local login successful, token:', access_token?.substring(0, 20) + '...', 'tabs:', allowed_tabs);
      
      setToken(access_token);
      setAllowedTabs(allowed_tabs);
      status.textContent = '⚠️ Logged in (OFFLINE MODE)';
      
      try { 
        setupTabsForUser(); 
        console.log('[LOGIN] Tabs setup completed');
      } catch (e) {
        console.warn('[LOGIN] Tab setup failed:', e);
      }
      
      const dest = getDefaultAllowedPath(allowed_tabs);
      console.log('[LOGIN] Navigating to:', dest);
      
      setTimeout(async () => {
        if (dest && dest !== '/login') {
          await navigate(dest, true);
        } else {
          console.warn('[LOGIN] No valid destination path found, staying on login');
          status.textContent = 'Login successful but no accessible pages found.';
        }
      }, 500);
      
    } catch (localError) {
      console.error('[LOGIN] Local login also failed:', localError);
      status.textContent = `Login failed: ${localError.message}`;
      clearToken();
      clearUser();
    }
  } finally {
    $('#loginBtn')?.removeAttribute('disabled');
  }
}

export async function init() {
  console.log('[LOGIN] Initializing login module');
  
  if (isAuthed()) {
    console.log('[LOGIN] Found existing auth token, validating...');
    
    const token = getToken();
    
    if (isLocalToken(token)) {
      console.log('[LOGIN] Local token detected, validating locally...');
      try {
        const { allowed_tabs } = validateLocalToken(token);
        console.log('[LOGIN] Local token valid, allowed tabs:', allowed_tabs);
        setAllowedTabs(allowed_tabs);
        try { setupTabsForUser(); } catch {}
        const dest = getDefaultAllowedPath(allowed_tabs);
        console.log('[LOGIN] Redirecting authenticated user to:', dest);
        if (dest && dest !== '/login') {
          await navigate(dest, true);
          return;
        }
      } catch (error) {
        console.warn('[LOGIN] Local token validation failed:', error);
        clearToken();
        clearUser();
      }
    } else {
      try {
        const { allowed_tabs } = await me();
        console.log('[LOGIN] Token valid, allowed tabs:', allowed_tabs);
        setAllowedTabs(allowed_tabs);
        try { setupTabsForUser(); } catch {}
        const dest = getDefaultAllowedPath(allowed_tabs);
        console.log('[LOGIN] Redirecting authenticated user to:', dest);
        if (dest && dest !== '/login') {
          await navigate(dest, true);
          return;
        } else {
          console.warn('[LOGIN] No accessible pages for authenticated user');
          return;
        }
      } catch (error) {
        console.warn('[LOGIN] Token validation failed:', error);
        clearToken();
        clearUser();
      }
    }
  }
  
  console.log('[LOGIN] Setting up login form event handlers');
  
  $('#loginBtn')?.addEventListener('click', (e) => {
    console.log('[LOGIN] Login button clicked');
    e.preventDefault();
    doLogin();
  });
  
  const form = document.querySelector('.login-wrapper form');
  form?.addEventListener('submit', (e) => {
    console.log('[LOGIN] Form submitted');
    e.preventDefault();
    doLogin();
  });
  
  ['#loginUsername', '#loginPassword'].forEach(sel => {
    document.querySelector(sel)?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doLogin();
      }
    });
  });
  
  console.log('[LOGIN] Login module initialization complete');
}
