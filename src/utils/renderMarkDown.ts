import MarkdownIt from 'markdown-it';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/default.css';

import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
// import { default as emoji }from 'markdown-it-emoji';
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
})
    .use(sub)
    .use(sup)
    // .use(emoji)
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

export const markdownItLatexPlugin = (md: { core: { ruler: { before: (arg0: string, arg1: string, arg2: (state: any) => void) => void; }; }; renderer: { rules: { latex_inline: (tokens: any, idx: any) => any; latex_block: (tokens: any, idx: any) => string; }; }; }) => {
    // 使用 renderLaTeX 函数来预处理 Markdown 内容
    md.core.ruler.before('normalize', 'latex_render', (state) => {
        state.src = renderLaTeX(state.src);
    });

    md.renderer.rules.latex_inline = (tokens, idx) => tokens[idx].content;
    md.renderer.rules.latex_block = (tokens, idx) => `<div class="katex-block">${tokens[idx].content}</div>`;
};

// 直接在 MarkdownIt 实例上添加 LaTeX 渲染规则
mdi.core.ruler.before('normalize', 'latex_render', (state) => {
    state.src = renderLaTeX(state.src);
});

mdi.renderer.rules.latex_inline = (tokens, idx) => tokens[idx].content;
mdi.renderer.rules.latex_block = (tokens, idx) => `<div class="katex-block">${tokens[idx].content}</div>`;

function renderLaTeX(text: string): string {
    try {
        // 正则表达式匹配行内和块级 LaTeX 公式
        const inlineRegex = /(?<!\\)\$(?!\$)([\s\S]*?)\$(?!\$)/g;
        const blockRegex = /(?<!\\)\$\$([\s\S]*?)\$\$/g;

        let result = text;

        // 处理块级公式
        result = result.replace(blockRegex, (match, formula) => {
            try {
                return `<div class="katex-block">${katex.renderToString(formula.trim(), { throwOnError: false, displayMode: true })}</div>`;
            } catch (error) {
                console.error('Block LaTeX rendering error:', error);
                return match;
            }
        });

        // 处理行内公式
        result = result.replace(inlineRegex, (match, formula) => {
            try {
                const renderedFormula = katex.renderToString(formula.trim(), { throwOnError: false });
                if (renderedFormula) {
                    return renderedFormula;
                } else {
                    console.warn('Failed to render LaTeX formula:', formula);
                    return match;
                }
            } catch (error) {
                console.error('Inline LaTeX rendering error:', error);
                return match;
            }
        });

        return result;
    } catch (error) {
        console.error('Unexpected error during LaTeX rendering:', error);
        return text;
    }
}

export default mdi;