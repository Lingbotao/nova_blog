import path from 'node:path';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { scryptSync, createCipheriv, randomFillSync, createDecipheriv } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const algorithm = 'aes-256-ctr';
const salt = 'nova_salt';
const password = 'nova_password';

function initSecretKey() {
  const key = scryptSync(password, salt, 32)
  return key.toString('hex')
}

function getSecretKey() {
  const filePath = path.join(__dirname, '/key', 'secret.txt')
  if(!existsSync(filePath)) {
    const key = initSecretKey()
    writeFileSync(filePath, key)
    return key
  }
  readFileSync(filePath)
}

function encrypt(content) {
  const buf = Buffer.alloc(16)
  const vi = randomFillSync(buf)
  const secret = getSecretKey()
  const cipher = createCipheriv(algorithm, secret, vi)
  const enciphered = Buffer.concat([cipher.update(content), cipher.final()])
  return {
    vi: vi.toString('hex'),
    context: enciphered.toString('hex')
  }
}

function decrypt(cryptMap) {
  const { vi, context } = cryptMap
  const secret = getSecretKey()
  const decipher = createDecipheriv(algorithm, secret, Buffer.from(vi, 'hex'))
  const content = Buffer.concat([decipher.update(Buffer.from(context, 'hex')), decipher.final()])
  return content.toString()
}

export {
  encrypt,
  decrypt
};