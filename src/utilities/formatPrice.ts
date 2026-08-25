export function formatWithToLocaleString(num: number, fractionDigits = 0) {
    if (!num) { return 0 }
    // 处理可能的精度问题
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    });
}