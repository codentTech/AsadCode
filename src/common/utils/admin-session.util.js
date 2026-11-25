const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

function canUseStorage() {
  return typeof window === "object" && window?.sessionStorage && window?.localStorage;
}

/**
 * Store impersonation restore credentials in sessionStorage only.
 * Migrates any legacy localStorage values and removes them.
 */
export function setAdminSession(token, userJson) {
  if (!canUseStorage() || !token || !userJson) return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_USER_KEY, userJson);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getAdminSession() {
  if (!canUseStorage()) {
    return { token: null, userJson: null };
  }

  let token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  let userJson = sessionStorage.getItem(ADMIN_USER_KEY);

  if (!token || !userJson) {
    const legacyToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const legacyUser = localStorage.getItem(ADMIN_USER_KEY);
    if (legacyToken && legacyUser) {
      setAdminSession(legacyToken, legacyUser);
      token = legacyToken;
      userJson = legacyUser;
    }
  }

  return { token, userJson };
}

export function clearAdminSession() {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function hasAdminSession() {
  return Boolean(getAdminSession().token);
}
