import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RSA 密钥存储路径
const KEYS_DIR = path.join(__dirname, '../keys');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.pem');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.pem');

/**
 * 生成RSA密钥对（2048位）
 * @returns {Object} { publicKeyPem, privateKeyPem }
 */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })

  const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
  const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  
  return { publicKeyPem, privateKeyPem }
}

/**
 * 初始化密钥文件（如果不存在则创建）
 */
function initializeKeys() {
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true })
  }

  if (!fs.existsSync(PUBLIC_KEY_PATH) || !fs.existsSync(PRIVATE_KEY_PATH)) {
    const { publicKeyPem, privateKeyPem } = generateKeyPair()
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKeyPem, { encoding: 'utf-8' })
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKeyPem, { encoding: 'utf-8' })
  }
}

/**
 * 获取公钥（PEM格式）
 * @returns {string} 公钥PEM字符串
 */
function getPublicKeyPem() {
  try {
    initializeKeys()
    return fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8')
  } catch (error) {
    console.error('获取公钥失败:', error)
    throw error
  }
}

/**
 * 获取私钥（PEM格式）
 * @returns {string} 私钥PEM字符串
 */
function getPrivateKeyPem() {
  try {
    initializeKeys()
    return fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8')
  } catch (error) {
    console.error('获取私钥失败:', error)
    throw error
  }
}

/**
 * RSA OAEP 解密（SHA-256）
 * @param {any} encryptedData 加密数据（base64编码）
 * @returns {Object} 解密后的JSON对象
 */
function decrypt(encryptedData) {
  try {
    const privateKeyPem = getPrivateKeyPem()
    const privateKey = crypto.createPrivateKey(privateKeyPem)
    
    // 将base64编码的数据转换为Buffer
    const encryptedBuffer = Buffer.from(encryptedData.encrypted, 'base64')
    
    // 使用RSA_PKCS1_OAEP_PADDING和SHA-256进行解密
    const decryptedBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      encryptedBuffer
    )
    
    // 解析JSON字符串
    const decryptedJSON = JSON.parse(decryptedBuffer.toString('utf-8'))
    return decryptedJSON
  } catch (error) {
    console.error('解密失败:', error.message)
    throw new Error('解密数据失败')
  }
}

export {
  generateKeyPair,
  initializeKeys,
  getPublicKeyPem,
  getPrivateKeyPem,
  decrypt
};
