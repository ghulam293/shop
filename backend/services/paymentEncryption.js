import crypto from 'crypto';

// Secret encryption key derived from environment or secure fallback
const ENCRYPTION_SECRET = process.env.PAYMENT_ENCRYPTION_KEY || 'SHOP_OMAN_PAYMENT_SECURE_ENCRYPTION_KEY_2026_OMR';
const ALGORITHM = 'aes-256-gcm';

// Derive 32-byte key using SHA-256
const key = crypto.createHash('sha256').update(String(ENCRYPTION_SECRET)).digest();

/**
 * Encrypt sensitive API/Secret key using AES-256-GCM
 */
export function encryptSecret(plainText) {
  if (!plainText) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `ENC:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive API/Secret key
 */
export function decryptSecret(encryptedPayload) {
  if (!encryptedPayload) return '';
  if (!encryptedPayload.startsWith('ENC:')) return encryptedPayload;

  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 4) return '***';

    const iv = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    const encryptedText = parts[3];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return '***';
  }
}

/**
 * Mask secret for safe display in Admin UI (e.g., sk_live_••••••••3821)
 */
export function maskSecret(secret) {
  if (!secret) return 'Not Configured';
  const clean = secret.startsWith('ENC:') ? decryptSecret(secret) : secret;
  if (!clean || clean.length < 6) return '••••••••';
  const start = clean.slice(0, 4);
  const end = clean.slice(-4);
  return `${start}••••••••${end}`;
}

/**
 * Compute HMAC-SHA256 signature for webhook verification
 */
export function generateWebhookSignature(payload, secretKey) {
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secretKey || ENCRYPTION_SECRET).update(data).digest('hex');
}

/**
 * Verify signed webhook payload
 */
export function verifyWebhookSignature(payload, signature, secretKey) {
  if (!signature) return false;
  try {
    const expected = generateWebhookSignature(payload, secretKey);
    const sigBuffer = Buffer.from(signature, 'hex');
    const expBuffer = Buffer.from(expected, 'hex');
    if (sigBuffer.length !== expBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expBuffer);
  } catch (err) {
    return false;
  }
}
