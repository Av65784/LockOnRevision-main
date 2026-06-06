export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function resolveRole(profile, email) {
  if (profile?.role === ROLES.ADMIN) return ROLES.ADMIN;
  const normalizedEmail = (email || profile?.email || "").toLowerCase();
  if (normalizedEmail && adminEmails.includes(normalizedEmail)) return ROLES.ADMIN;
  return profile?.role || ROLES.USER;
}

export function isAdmin(profile, email) {
  return resolveRole(profile, email) === ROLES.ADMIN;
}

export function canAccessAdmin(profile, email) {
  return isAdmin(profile, email);
}
