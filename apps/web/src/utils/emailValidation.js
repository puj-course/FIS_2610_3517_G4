const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_LENGTH = 64;
const MAX_DOMAIN_LENGTH = 253;
const MAX_DOMAIN_LABEL_LENGTH = 63;

export const isValidEmailFormat = (value) => {
  const email = String(value ?? '').trim();
  if (!email || email.length > MAX_EMAIL_LENGTH) return false;
  if (Array.from(email).some((character) => character.trim().length === 0)) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (local.length > MAX_LOCAL_LENGTH) return false;
  if (domain.length > MAX_DOMAIN_LENGTH) return false;
  if (!domain.includes('.')) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;

  return domain
    .split('.')
    .every((label) => label.length > 0 && label.length <= MAX_DOMAIN_LABEL_LENGTH);
};
