import { getPubKey } from "@/api"
import JSEncrypt from "jsencrypt";

/**
 * 从本地存储获取缓存的RSA公钥
 * @returns 公钥字符串或空字符串
 */
export function getPrivateStorage() {
  return localStorage.getItem('nova_blog_rsa_key');
}

/**
 * 将RSA公钥保存到本地存储
 * @param data 公钥数据
 */
export async function setPrivateStorage(data: any) {
  localStorage.setItem('nova_blog_rsa_key', data);
}

/**
 * 获取RSA公钥
 * 优先使用本地缓存，如果没有则从服务器获取
 * @returns RSA公钥(SPKI PEM格式)
 */
export async function getRsaKey() {
  let secretKey = getPrivateStorage() || '';
  
  if(['', undefined, null].includes(secretKey)) {
    try {
      const res = await getPubKey();
      if(res.code !== 200) {
        throw new Error('获取密钥失败！');
      }
      secretKey = res.data.pub_key;
      // 缓存到本地
      await setPrivateStorage(secretKey);
    } catch(e) {
      window.$message.error('获取公钥失败: ' + (e as Error).message);
      throw e;
    }
  }
  
  return secretKey;
}

/**
 * 使用RSA加密参数（PKCS1 v1.5 padding）
 * 这是JSEncrypt的默认加密方式
 * @param param 要加密的参数对象
 * @returns 加密后的base64字符串
 */
export async function encryptParam(param: any) {
  const key = await getRsaKey();
  const encrypter = new JSEncrypt();
  encrypter.setPublicKey(key);
  return encrypter.encrypt(JSON.stringify(param))
}