export class StringUtils {
    /**
     * 使用正则来校验邮箱是否正确
     * @param email 邮箱
     */
    public static isEmail(email: string): boolean {
        // 正则表达式判断邮箱格式
        const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return emailRegex.test(email);
    }

    /**
     * 使用正则来校验密码的复制度
     * @param password 密码
     */
    public static isPasswordComplex(password: string): boolean {
        // 判断密码是否符合复杂度要求
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }
}
