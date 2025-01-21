export const renderMarkDown = (text: string) => {
    interface Rule {
        regex: RegExp;
        replacement: string | ((match: string, p1: string, p2?: string, p3?: string, p4?: string, p5?: string) => string);
    }

    const rules: Rule[] = [
        {
            regex: /(?<!\\)^\>+(.*)/gim, replacement: (match: string, p1: string) => {
                const matchResult = match.match(/^\>+/);
                const level = matchResult ? matchResult[0].length : 0;
                return `<blockquote>${'<blockquote>'.repeat(level - 1)}<p>${p1.trim()}</p>${'</blockquote>'.repeat(level - 1)}</blockquote>`;
            }
        },
        { regex: /(?<!\\)\n/gim, replacement: '<br />' },
        { regex: /(?<!\\)###### (.*$)/gim, replacement: '<h6>$1</h6>' },
        { regex: /(?<!\\)##### (.*$)/gim, replacement: '<h5>$1</h5>' },
        { regex: /(?<!\\)#### (.*$)/gim, replacement: '<h4>$1</h4>' },
        { regex: /(?<!\\)### (.*$)/gim, replacement: '<h3>$1</h3>' },
        { regex: /(?<!\\)## (.*$)/gim, replacement: '<h2>$1</h2>' },
        { regex: /(?<!\\)# (.*$)/gim, replacement: '<h1>$1</h1>' },
        { regex: /(?<!\\)---/gim, replacement: '<hr />' },
        {
            regex: /(?<!\\)\!\[(.*?)\]\((.*?)(?: \s*=\s*(\d*)?x?(\d*))?(?: \s*:(left|right|center))?\)/gim, replacement: (match: string, alt: string, src?: string, width?: string, height?: string, align?: string) => {
                let imgTag = `<img alt="${alt}" src="${src}"`;
                if (width) imgTag += ` width="${width}"`;
                if (height) imgTag += ` height="${height}"`;
                if (align) {
                    imgTag = `<div align="${align}">${imgTag} /></div>`;
                } else {
                    imgTag += ' />';
                }
                return imgTag;
            }
        },
        { regex: /(?<!\\)\[(.*?)\]\((.*?)\)/gim, replacement: '<a href="$2">$1</a>' },
        // { regex: /(?<!\\)  $/gim, replacement: '<br />' },
        { regex: /(?<!\\)~~(.+?)~~/gim, replacement: '<s>$1</s>' },
        { regex: /(?<!\\)- (.*$)/gim, replacement: '<ul><li>$1</li></ul>' },
        { regex: /(?<!\\)(\d+)\. (.*$)/gim, replacement: '<ol><li>$2</li></ol>' },
        { regex: /(?<!\\)\*\*\*(.+?)\*\*\*/gim, replacement: '<strong><em>$1</em></strong>' },
        { regex: /(?<!\\)^___(.+?)___$/gim, replacement: '<strong><em>$1</em></strong>' },
        { regex: /(?<!\\)\*\*(.+?)\*\*/gim, replacement: '<strong>$1</strong>' },
        { regex: /(?<!\\)^__(.+?)__$/gim, replacement: '<strong>$1</strong>' },
        { regex: /(?<!\\)\*(.+?)\*/gim, replacement: '<em>$1</em>' },
        { regex: /(?<!\\)^_(.+?)_$/gim, replacement: '<em>$1</em>' },
        { regex: /(?<!\\)__\*(.+?)\*__/gim, replacement: '<strong><em>$1</em></strong>' },
        { regex: /(?<!\\)\*\*_(.+?)_\*\*/gim, replacement: '<strong><em>$1</em></strong>' },
        { regex: /(?<!\\)```([\s\S]*?)```/gim, replacement: '<pre><code>$1</code></pre>' },
        { regex: /(?<!\\)``([\s\S]*?)``/gim, replacement: '<code>$1</code>' },
        { regex: /(?<!\\)<((https?:\/\/[^\s]+))>/gim, replacement: '<a href="$1">$1</a>' },
        { regex: /(?<!\\)<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/gim, replacement: '<a href="mailto:$1">$1</a>' },
        {
            regex: /^(?!<blockquote|<h[1-6]|<hr|<img|<a|<ul|<ol|<strong|<em|<pre|<code|<li|<s).*$/gm,
            replacement: (match: string) => `<p>${match.trim()}</p>`
        },
    ];

    // 提取并替换公式，使用占位符
    const latexs: string[] = [];
    text = text.replace(/(?<!\\)\$([\s\S]*?)\$/gim, (match, p1) => {
        latexs.push(p1);
        return `LATEX_${latexs.length - 1}`;
    });

    // 提取并替换代码块，使用占位符
    const codeBlocks: string[] = [];
    text = text.replace(/(?<!\\)```([\s\S]*?)```/gim, (match, p1) => {
        codeBlocks.push(p1);
        return `CODE_BLOCK_${codeBlocks.length - 1}`;
    });
    text = text.replace(/(?<!\\)``([\s\S]*?)``/gim, (match, p1) => {
        codeBlocks.push(p1);
        return `CODE_ROW_${codeBlocks.length - 1}`;
    });
    let html = text;
    rules.forEach(rule => {
        if (typeof rule.replacement === 'string') {
            html = html.replace(rule.regex, rule.replacement);
        } else {
            html = html.replace(rule.regex, rule.replacement);
        }
    });

    // 修复跨行分为多段引用的问题
    html = html.replace(/<\/blockquote>\s*<blockquote>/gim, '');

    // 修复无序列表跨行变为多段的问题
    html = html.replace(/<\/ul>\s*<ul>/gim, '');

    // 修复有序列表跨行变为多段的问题
    html = html.replace(/<\/ol>\s*<ol>/gim, '');

    html=html.replace(/\\</,'&lt;');

    // 去除用于转义的反斜杠字符，除非该反斜杠前有反斜杠
    html = html.replace(/\\(?!\\)/g, '');

    // 恢复公式
    html = html.replace(/LATEX_(\d+)/g, (match, p1) => {
        return `\$${latexs[parseInt(p1)]}\$`;
    });

    // 恢复代码块
    html = html.replace(/CODE_BLOCK_(\d+)/g, (match, p1) => {
        return `<pre><code>${codeBlocks[parseInt(p1)].replace(/</g, '&lt;')}</code></pre>`;
    });
    
    html = html.replace(/CODE_ROW_(\d+)/g, (match, p1) => {
        return `<code>${codeBlocks[parseInt(p1)].replace(/</g, '&lt;')}</code>`;
    });
    
    return html.trim();
}