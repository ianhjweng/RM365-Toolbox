# modules/_integrations/zoho/client.py
import time
import requests
from typing import Optional
from core.config import settings

# Config (env-driven). You already have these in core.config.Settings.
CLIENT_ID: Optional[str] = settings.ZC_CLIENT_ID
CLIENT_SECRET: Optional[str] = settings.ZC_CLIENT_SECRET
REFRESH_TOKEN: Optional[str] = settings.ZC_REFRESH_TOKEN

# Optional override if you’re in EU/IN/… (defaults to .com)
# e.g. set ZOHO_ACCOUNTS_BASE=https://accounts.zoho.eu in your .env
ACCOUNTS_BASE: str = getattr(settings, "ZOHO_ACCOUNTS_BASE", "https://accounts.zoho.com")

_cached_token: Optional[str] = None
_last_refresh: float = 0.0
# Be conservative: refresh every 45 minutes
_TOKEN_TTL: int = 2700

def _require_creds():
    if not (CLIENT_ID and CLIENT_SECRET and REFRESH_TOKEN):
        raise RuntimeError("Zoho OAuth creds aren’t configured (ZC_CLIENT_ID/SECRET/REFRESH_TOKEN).")

def _refresh_token() -> str:
    """Exchange the refresh token for a new access token."""
    global _cached_token, _last_refresh
    _require_creds()

    url = f"{ACCOUNTS_BASE}/oauth/v2/token"
    data = {
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
    }
    resp = requests.post(url, data=data, timeout=20)
    if not resp.ok:
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text
        raise RuntimeError(f"Zoho token refresh failed: {resp.status_code} {detail}")

    body = resp.json()
    token = body.get("access_token")
    if not token:
        raise RuntimeError(f"Zoho token refresh response didn’t include access_token: {body}")

    _cached_token = token
    _last_refresh = time.time()
    return _cached_token

def _get_cached_token() -> str:
    """Return a valid access token, refreshing if stale."""
    global _cached_token, _last_refresh
    if not _cached_token or (time.time() - _last_refresh) > _TOKEN_TTL:
        return _refresh_token()
    return _cached_token

def get_cached_creator_token() -> str:
    """Historically used for Zoho Creator; same token if scopes are combined."""
    return _get_cached_token()

def get_cached_inventory_token() -> str:
    """Historically used for Zoho Inventory; same token if scopes are combined."""
    return _get_cached_token()

def zoho_auth_header() -> dict:
    """Convenience: Authorization header for requests."""
    return {"Authorization": f"Zoho-oauthtoken {_get_cached_token()}"}
