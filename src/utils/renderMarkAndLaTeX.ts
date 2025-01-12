import { renderMarkDown } from "./renderMarkDown";
import { renderLaTeX } from "./renderLaTeX";
import sanitizeHtml, { type IOptions } from 'sanitize-html';
export const renderMarkAndLaTeX = (text: string) => {
    const html = renderMarkDown(text);
    const options: IOptions = {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'width', 'height'],
            div: ['align']
        },
        allowedSchemes: ['http', 'https', 'blob'],
    };
    const cleanHtml = sanitizeHtml(html, options);
    const cleanHtml_ = renderLaTeX(cleanHtml);
    return cleanHtml_.trim();
}