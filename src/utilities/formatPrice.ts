export function formatWithToLocaleString(num: number) {
    if (!num) { return 0 }
    // 处理可能的精度问题
    return num.toLocaleString('zh-CN', {
        maximumFractionDigits: 0 // 保留最多20位小数
    });
}