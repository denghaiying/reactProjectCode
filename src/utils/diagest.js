/* eslint-disable no-nested-ternary */
import crypto from 'crypto';

const diagest = {};

diagest.md5 = (data) => {
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
};

diagest.desencode = (key, data) => {
  const l = key.length;
  const k = l < 8 ? `${key}${'0'.repeat(8 - l)}` : (l > 8 ? key.substr(l - 8, 8) : key);
  const cipher = crypto.createCipheriv('des-ecb', Buffer.from(k), Buffer.alloc(8));
  cipher.setAutoPadding(true);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

diagest.desdeccode = (key, data) => {
  const l = key.length;
  const k = l < 8 ? `${key}${'0'.repeat(8 - l)}` : (l > 8 ? key.substr(l - 8, 8) : key);
  const decipher = crypto.createDecipheriv('des-ecb', Buffer.from(k), Buffer.alloc(8));
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

diagest.uuid = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  }).toLowerCase();
};

export default diagest;
