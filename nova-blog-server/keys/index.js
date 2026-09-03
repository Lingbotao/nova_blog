// @ts-nocheck
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createKey = () => {
  // 生成RSA密钥对
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding:  {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })

  // 导出密钥对为pem格式
  // const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
  // const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem'}).toString()
  return {
    publicKey,
    privateKey
  }
}

function getPubKeyPem() {
  try {
    const filePath = path.join(__dirname, 'public.pem')
    const publickKey = fs.readFileSync(filePath, { encoding: 'utf-8'})
    const { publicKeyPem, privateKeyPem } = createKey()
    if(!publickKey) {
      setPubKeyPem(publicKeyPem)
      setPrivateKeyPem(privateKeyPem)
      return publicKeyPem
    }
    return publicKeyPem
  } catch(e) {
    throw(e)
  }
}

function setPubKeyPem(pubKey) {
  const filePath = path.join(__dirname, 'public.pem')
  fs.writeFileSync(filePath, pubKey)
}

function getPrivateKeyPem() {
  try {
    const filePath = path.join(__dirname, 'private.pem')
    let privateKey; 
    if(fs.existsSync(filePath)) {
      privateKey = fs.readFileSync(filePath, { encoding: 'utf-8'})
    }
    if(!privateKey) {
      const { publicKeyPem, privateKeyPem } = createKey()
      setPubKeyPem(publicKeyPem)
      setPrivateKeyPem(privateKeyPem)
      return privateKeyPem
    }
    return privateKey
  } catch(e) {
    throw(e)
  }
}

function setPrivateKeyPem(priKey) {
  const filePath = path.join(__dirname, 'private.pem')
  fs.writeFileSync(filePath, priKey)
}

function privateDecrypto(encrypto) {
  const privateKeyPem = getPrivateKeyPem()
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  const encryptedData = Buffer.from(encrypto, 'base64')
  // decrypto
  const decryptedBuffer = crypto.privateDecrypt({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  },encryptedData)
  return JSON.parse(decryptedBuffer.toString('utf-8'))
}

export {
  getPubKeyPem,
  getPrivateKeyPem,
  privateDecrypto
};