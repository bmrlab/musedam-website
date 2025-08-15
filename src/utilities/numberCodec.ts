// 编码函数：将数字转换为Base64字符串
export function encodeNumber(num: number) {
    // 先将数字转换为字符串，再转换为UTF-8编码的Uint8Array
    const text = num.toString();
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(text);

    // 转换为Base64
    return btoa(String.fromCharCode(...uint8Array));
}

// 解码函数：将Base64字符串转换回数字
export function decodeNumber(encodedStr: string) {
    // 从Base64转换回字符串
    const decodedStr = atob(encodedStr);

    // 转换回数字
    return decodedStr;
}