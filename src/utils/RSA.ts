import { KJUR, KEYUTIL, RSAKey } from 'jsrsasign'
import JSEncrypt from 'jsencrypt'

export class RSA {
  /**
   * 生成RSA公钥和私钥
   * @param keySize 密钥长度
   * @returns RSA公钥和私钥
   */
  public static generateRSAKey(keySize: number) {
    const rsaKeypair = KEYUTIL.generateKeypair('RSA', keySize)
    const pub = KEYUTIL.getPEM(rsaKeypair.pubKeyObj)
    const prv = KEYUTIL.getPEM(rsaKeypair.prvKeyObj, 'PKCS8PRV')
    console.log(pub)
    console.log(prv)
  }

  /**
   * 公钥加密
   * @param data 待加密数据
   * @param pubKey 公钥
   * @returns 加密后的数据
   */
  public static encryptByPublicKey(data: string, pubKey: string) {
    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(pubKey)
    return jsEncrypt.encrypt(data)
  }
}
