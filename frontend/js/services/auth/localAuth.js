// frontend/js/services/auth/localAuth.js

const LOCAL_USERS = {
  'admin': {
    password: 'admin123',
    allowed_tabs: ['attendance', 'enrollment', 'inventory', 'labels', 'sales-imports', 'usermanagement']
  },
  'user': {
    password: 'user123',
    allowed_tabs: ['attendance', 'enrollment', 'inventory', 'labels']
  },
  'demo': {
    password: 'demo',
    allowed_tabs: ['attendance', 'labels']
  }
};

function generateLocalToken(username) {
  const payload = {
    sub: username,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000),
    local: true
  };
  return 'local.' + btoa(JSON.stringify(payload));
}

export function loginLocal(username, password) {
  console.log('[LOCAL_AUTH] Attempting local authentication for:', username);
  
  const user = LOCAL_USERS[username];
  
  if (!user) {
    console.log('[LOCAL_AUTH] User not found:', username);
    throw new Error('Invalid username or password (offline mode)');
  }
  
  if (user.password !== password) {
    console.log('[LOCAL_AUTH] Invalid password for:', username);
    throw new Error('Invalid username or password (offline mode)');
  }
  
  console.log('[LOCAL_AUTH] Login successful for:', username, 'tabs:', user.allowed_tabs);
  
  return {
    access_token: generateLocalToken(username),
    allowed_tabs: user.allowed_tabs
  };
}

export function validateLocalToken(token) {
  console.log('[LOCAL_AUTH] Validating local token');
  
  if (!token || !token.startsWith('local.')) {
    throw new Error('Invalid local token');
  }
  
  try {
    const payloadStr = atob(token.substring(6));
    const payload = JSON.parse(payloadStr);
    
    if (payload.exp < Date.now()) {
      console.log('[LOCAL_AUTH] Token expired');
      throw new Error('Token expired');
    }
    
    const user = LOCAL_USERS[payload.sub];
    if (!user) {
      console.log('[LOCAL_AUTH] User no longer exists:', payload.sub);
      throw new Error('Invalid token');
    }
    
    console.log('[LOCAL_AUTH] Token valid for:', payload.sub, 'tabs:', user.allowed_tabs);
    
    return {
      allowed_tabs: user.allowed_tabs
    };
  } catch (e) {
    console.error('[LOCAL_AUTH] Token validation failed:', e);
    throw new Error('Invalid token');
  }
}

export function isLocalToken(token) {
  return token && token.startsWith('local.');
}
