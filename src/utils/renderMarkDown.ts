import MarkdownIt from 'markdown-it';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/default.css';

import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
// import { default as emoji }from 'markdown-it-emoji';
import taskLists from 'markdown-it-task-lists';
import footnote from 'markdown-it-footnote';
import ins from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const mdi = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
})
    .use(sub)
    .use(sup)
    // .use(emoji)
    .use(taskLists)
    .use(footnote)
    .use(ins)
    .use(mark)

// 禁用 image 规则
mdi.disable('image');
delete mdi.renderer.rules.image;

// 自定义 image 规则
mdi.renderer.rules.image_custom = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const altText = token.children ? self.renderInlineAsText(token.children, options, env) : '';
    const src = token.attrGet('src') || '';
    let width = '', height = '', align = '';

    // 解析可能存在的宽度、高度和对齐参数
    if (token.attrIndex('title') !== -1) {
        const title = token.attrGet('title');
        const regex = /(\d*)x?(\d*)?\s*:\s*(left|right|center)?/;
        const matches = title?.match(regex);
        if (matches) {
            width = matches[1] || '';
            height = matches[2] || '';
            align = matches[3] || '';
        }
    }

    let imgTag = `<img alt="${altText}" src="${src}"`;
    if (width) imgTag += ` width="${width}"`;
    if (height) imgTag += ` height="${height}"`;
    if (align) {
        imgTag = `<div align="${align}">${imgTag} /></div>`;
    } else {
        imgTag += ' />';
    }
    return imgTag;
};

// 定义一个插件来应用新的规则
mdi.use((md) => {
    md.inline.ruler.before('link', 'image_custom', (state, silent) => {
        const pos = state.pos;
        const max = state.posMax;

        // 正确的正则表达式匹配
        const regex = /(?<!\\)\!\[(.*?)\]\((.*?)(?: \s*=\s*(\d*)?x?(\d*))?(?: \s*:(left|right|center))?\)/gim;
        const match = regex.exec(state.src.slice(pos, max));

        if (!match) return false;

        const [fullMatch, alt, url, w, h, alignment] = match;

        // 如果是静默模式（silent），仅检查是否匹配而不生成令牌
        if (silent) return true;

        // 创建令牌
        const token = state.push('image_custom', 'img', 0);
        token.attrs = [
            ['src', url],
            ['alt', alt]
        ];
        if (w || h || alignment) {
            token.attrSet('title', `${w || ''} ${h || ''} : ${alignment || ''}`.trim());
        }

        // 更新状态的位置
        state.pos += fullMatch.length;

        return true;
    });
});

// 定义渲染LaTeX函数
const renderLaTeX = (formula: string, displayMode: boolean) => {
    try {
        return katex.renderToString(formula, {
            throwOnError: false,
            displayMode: displayMode
        });
    } catch (error) {
        console.error('LaTeX rendering error:', error);
        return `$${displayMode ? '$' : ''}${formula}$${displayMode ? '$' : ''}`;
    }
};

// 添加自定义规则来处理LaTeX
mdi.use((md) => {
    md.inline.ruler.before('escape', 'latex_inline', (state, silent) => {
        const pos = state.pos;
        const max = state.posMax;

        // 匹配内联LaTeX公式
        const regexInline = /(?<!\\)\$(?!\$)([\s\S]*?)\$(?!\$)/g;
        const matchInline = regexInline.exec(state.src.slice(pos, max));

        if (!silent && matchInline) {
            const [fullMatch, formula] = matchInline;
            const token = state.push('latex', '', 0);
            token.content = renderLaTeX(formula.trim(), false);
            state.pos += fullMatch.length;
            return true;
        }

        return false;
    });

    md.block.ruler.before('fence', 'latex_block', (state, startLine, endLine, silent) => {
        let pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];

        // 匹配块级LaTeX公式
        const regexBlock = /^(?<!\\)\$\$(?!\$)[\s\S]*?(?<!\\)\$\$/;
        const matchBlock = state.src.slice(pos, max).match(regexBlock);

        if (!silent && matchBlock) {
            const formula = matchBlock[0].slice(2, -2).trim(); // 去掉外侧的 $$
            const token = state.push('latex', '', 0);
            token.content = renderLaTeX(formula, true);
            state.line = startLine + 1;
            return true;
        }

        return false;
    });

    // 自定义渲染规则
    md.renderer.rules.latex = (tokens, idx) => tokens[idx].content;
});

export default mdi;