import katex from 'katex';
import 'katex/dist/katex.min.css';

export const renderLaTeX = (text: string): string => {
    try {
        // 检查是否有需要处理的公式
        if (!/\$.*?\$/g.test(text)) {
            return text;
        }

        // 更严格的正则表达式匹配完整的公式块
        const regex = /(?<!\\)\$(?!\$)([\s\S]*?)\$(?!\$)/g;
        let match;
        let result = text;

        // 使用 split 和 map 减少字符串操作次数
        const parts = text.split(regex);
        result = parts.map((part, index) => {
            if (index % 2 === 1) { // 奇数索引为公式部分
                const formula = part.trim();
                try {
                    const renderedFormula = katex.renderToString(formula, {
                        throwOnError: false,
                    });
                    if (renderedFormula) {
                        return renderedFormula;
                    } else {
                        console.warn('Failed to render LaTeX formula:', formula);
                        return `$${formula}$`;
                    }
                } catch (error) {
                    console.error('LaTeX rendering error:', error);
                    return `$${formula}$`;
                }
            }
            return part;
        }).join('');

        return result;
    } catch (error) {
        console.error('Unexpected error during LaTeX rendering:', error);
        return text;
    }
};