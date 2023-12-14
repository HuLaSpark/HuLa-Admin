import JSEncrypt from 'jsencrypt'

export class RSA {
  // private static privateKey =
  //   '-----BEGIN RSA PRIVATE KEY-----' +
  //   'MIICXAIBAAKBgQCQeu3C0xTXqWiy4GWeYxOBpeDoOoarCUGy6A3u20khjSN7I6nT' +
  //   'Qpe4J1QV+TWoGV6s8n88dbbBcT9Hyy39NiuOk0vol/E+LDL04VEZn8MN+61EW3aZ' +
  //   '18fw04rzXnOD6snQwdnFx2ipmfDit8pnX9RdM6Q14wSRL/paQ6wcBhN9OwIDAQAB' +
  //   'AoGARAsxCM1ChqMJZR0bnrGIkUmfF5/gppKQd4KkdTafRYbkC+1q4Mz/CUK0bjjV' +
  //   'FVsFZKw8UiwaKxZ7uAMvoI4vipunkWifX4vn1s3XP6h/Ill4x+HkLNost5vyimIa' +
  //   'CDuNz1gCilrNqsdQa0TneVPtJLUenrZNPqsXfUFY0Em0nIECQQDObNtP4zJr11Sm' +
  //   'sLUP9mc8HAnP3igARgGIFK+BEogp8Lnq8quYahbZFeNmzE18ms1MGocQmfaLjQ4t' +
  //   'lJZurXdBAkEAsy2nxHHOlFiEmo5/hRoFUmXuG9sS8fYWmou4KzVA8mOJXfdY+dp4' +
  //   '3gqChxbh2UjVsqSh0TsP4tbhGdk8TLfxewJAdc9kv0xAa5HCazvwqkKLmp+57dux' +
  //   'Yq6RkzOTEowcECumP/PtgRgTICRA21uAYbwLrQJ60Tu9nNmNHPBvho0TwQJBAJSn' +
  //   '60nzdgXjztiAI1JlvUaYpM1dm8E9f5FnHDxU6XZwmJZqUdqxpJfrtlGn7Wcdo5ac' +
  //   'OljiHJMB3i5Y6ktoTSMCQCqOCqsaCzVNAlfIWuw2C/XcZqsyodUqXYl9dS6Lu1+6' +
  //   '9+SbUtThFmel7dwUnJ4xKPeOYUcOhdbhDu4rv/VJu+8=' +
  //   '-----END RSA PRIVATE KEY-----'
  // private static publicKey =
  //   'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQeu3C0xTXqWiy4GWeYxOBpeDo' +
  //   'OoarCUGy6A3u20khjSN7I6nTQpe4J1QV+TWoGV6s8n88dbbBcT9Hyy39NiuOk0vo' +
  //   'l/E+LDL04VEZn8MN+61EW3aZ18fw04rzXnOD6snQwdnFx2ipmfDit8pnX9RdM6Q1' +
  //   '4wSRL/paQ6wcBhN9OwIDAQAB'

  /**
   * 公钥加密
   * @param data 待加密数据
   * @param pubKey 公钥
   * @returns 加密后的数据
   */
  public static encryptByPublicKey(data: string, pubKey: string) {
    // TODO 还需要实现加签 (nyh-2023-11-28 08:11:39)
    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(pubKey)
    return jsEncrypt.encrypt(data)
  }

  /**
   * 获取公钥
   */
  // public static getPublicKey() {
  //   return this.publicKey
  // }

  // /**
  //  * 私钥解密
  //  * @param data 待解密数据
  //  */
  // public static decryptByPrivateKey(data: string) {
  //   const jsEncrypt = new JSEncrypt()
  //   jsEncrypt.setPrivateKey(this.privateKey)
  //   const decryptData = jsEncrypt.decrypt(data)
  //   // 转换编码为utf-8
  //   console.log(decryptData.toString())
  // }
}
