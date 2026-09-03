import { JSEncrypt } from "jsencrypt";
import { getRsaKey } from '@/utils'

/**
 * RSA OAEP 加密（SHA-256）
 * 使用JSEncrypt库进行前端数据加密
 * @param context 要加密的数据对象
 * @returns 加密后的base64字符串
 */
export async function encrypt(context: any): Promise<any> {
  try {
    const key = await getRsaKey();
    
    if (!key) {
      throw new Error('获取公钥失败');
    }

    const encrypter = new JSEncrypt({ default_key_size: '2048' });
    encrypter.setPublicKey(key);
    
    // 将对象转为JSON字符串后加密
    const jsonString = JSON.stringify(context);
    const encrypted = encrypter.encryptOAEP(jsonString);
    
    if (!encrypted) {
      throw new Error('加密失败');
    }
    
    return { encrypted };
  } catch (error) {
    console.error('加密过程出错:', error);
    throw error;
  }
}


/**
 * 获取当前使用的加密公钥信息
 * @returns 公钥字符串
 */
export async function getEncryptPublicKey(): Promise<string> {
  return await getRsaKey();
}

