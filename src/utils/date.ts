export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1，并且补0
    const day = date.getDate().toString().padStart(2, '0'); // 日期补0
    return `${year}-${month}-${day}`;
}

export function formatDataTimeStr(time: string | undefined) {
    if (!time || time === '') {
        return '';
    }

    try {
        const date = new Date(time);
        if (isNaN(date.getTime())) {
            // 如果时间字符串无效，返回默认值
            return '';
        }

        // 使用固定格式输出时间字符串
        const timestr = date.toLocaleString().replace(/\//g, '-');
        const [datePart, timePart] = timestr.split(' ');
        const [year, month, day] = datePart.split('-').map(part => part.padStart(2, '0'));
        return `${year}-${month}-${day} ${timePart}`;
    } catch (error) {
        // 捕获任何可能的异常并返回默认值
        return '';
    }
}

export function formatTimeStr(time: string | undefined) {
    if (!time || time === '') {
        return '';
    }
    try {
        const date = new Date(time);
        if (isNaN(date.getTime())) {
            // 如果时间字符串无效，返回默认值
            return '';
        }
        return date.toLocaleTimeString().replace(/\//g, '-');
    } catch (error) {
        // 捕获任何可能的异常并返回默认值
        return '';
    }
}

export function formatDateStr(time: string | undefined) {
    if (!time || time === '') {
        return '';
    }
    try {
        const date = new Date(time);
        if (isNaN(date.getTime())) {
            // 如果时间字符串无效，返回默认值
            return '';
        }
        const dateStr = date.toLocaleDateString().replace(/\//g, '-');
        const [year, month, day] = dateStr.split('-').map(part => part.padStart(2, '0'));
        return `${year}-${month}-${day}`;
    } catch (error) {
        // 捕获任何可能的异常并返回默认值
        return '';
    }
}

export const futureDate = (time: Date) => {
    return time.getTime() > Date.now()
}