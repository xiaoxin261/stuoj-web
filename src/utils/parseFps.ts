import type { ProblemInfo, Solution, Testcase } from "@/types/Problem";
import { langStore } from "@/stores/language";

// 辅助函数：从父元素中获取指定标签的文本内容（去除空白）
function getElementTextContent(parent: Element, tag: string): string | undefined {
    const element = parent.querySelector(tag);
    return element ? element.textContent?.trim() : undefined;
}

/**
 * 解析传入的 FPS 格式 XML 字符串，并返回包含 ProblemInfo、Testcase、Solution 的对象
 * @param xmlString XML 文件内容字符串
 * @param onProgress 进度回调函数
 */
export async function parseFpsXml(xmlString: string, onProgress?: (current: number, total: number) => void): Promise<{
    version: string;
    items: {
        problem: ProblemInfo;
        testcases: Testcase[];
        solutions: Solution[];
    }[];
    generator?: { name: string; url?: string };
    url?: string;
}> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    
    // 检查解析错误
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
        throw new Error("XML解析错误：" + parserError.textContent);
    }

    const fpsEl = xmlDoc.documentElement;
    if (fpsEl.tagName !== "fps") {
        throw new Error("不是有效的FPS格式XML！");
    }

    // 解析 fps 属性
    const version = fpsEl.getAttribute("version") || "";
    const urlAttr = fpsEl.getAttribute("url") || undefined;
    
    // 解析 generator 节点
    let generator;
    const generatorEl = fpsEl.querySelector("generator");
    if (generatorEl) {
        const name = generatorEl.getAttribute("name") || "";
        const genUrl = generatorEl.getAttribute("url") || undefined;
        generator = { name, url: genUrl };
    }

    // 从 langStore 获取语言列表，用于匹配 solution 中的语言
    const store = langStore();
    const langRef = await store.getLanguages();
    const languages = langRef.value;

    // 辅助函数：根据 XML 中的语言字符串从 languages 中获取最接近的语言 id
    function getClosestLanguageId(xmlLang: string): number {
        if (!xmlLang) return 0;
        const lowerXml = xmlLang.toLowerCase();
        for (const lang of languages) {
            if (lang.name.toLowerCase().includes(lowerXml)) {
                return lang.id || 0;
            }
        }
        return 0;
    }

    // 解析 <item> 节点数组（使用异步循环以支持逐步更新）
    const itemEls = fpsEl.querySelectorAll("item");
    const total = itemEls.length;
    const items: {
        problem: ProblemInfo;
        testcases: Testcase[];
        solutions: Solution[];
    }[] = [];

    for (let i = 0; i < total; i++) {
        const itemEl = itemEls[i];
        const title = getElementTextContent(itemEl, "title") || "";
        const description = getElementTextContent(itemEl, "description") || "";
        const inputStr = getElementTextContent(itemEl, "input") || "";
        const outputStr = getElementTextContent(itemEl, "output") || "";
        const sample_input = getElementTextContent(itemEl, "sample_input") || "";
        const sample_output = getElementTextContent(itemEl, "sample_output") || "";
        const hint = getElementTextContent(itemEl, "hint") || "";
        
        // 解析 time_limit 和 memory_limit 并转换为数字
        let time_limit = 0;
        const timeLimitEl = itemEl.querySelector("time_limit");
        if (timeLimitEl) {
            const data = timeLimitEl.textContent?.trim() || "0";
            time_limit = Number(data);
        }
        
        let memory_limit = 0;
        const memoryLimitEl = itemEl.querySelector("memory_limit");
        if (memoryLimitEl) {
            const data = memoryLimitEl.textContent?.trim() || "0";
            memory_limit = Number(data);
        }
        
        const problem: ProblemInfo = {
            title,
            description,
            input: inputStr,
            output: outputStr,
            sample_input,
            sample_output,
            hint,
            time_limit,
            memory_limit,
            difficulty: 0,
        };

        // 解析测试用例
        const testcases: Testcase[] = [];
        const testInputEls = itemEl.querySelectorAll("test_input");
        const testOutputEls = itemEl.querySelectorAll("test_output");
        if (testInputEls.length > 0 && testInputEls.length === testOutputEls.length) {
            testInputEls.forEach((el, index) => {
                const ti = el.textContent?.trim() || "";
                const to = testOutputEls[index].textContent?.trim() || "";
                testcases.push({ test_input: ti, test_output: to });
            });
        }

        // 解析题解
        const solutions: Solution[] = [];
        const solutionEls = itemEl.querySelectorAll("solution");
        if (solutionEls.length > 0) {
            solutionEls.forEach(solEl => {
                const xmlLang = solEl.getAttribute("language") || "";
                const code = solEl.textContent?.trim() || "";
                const language_id = getClosestLanguageId(xmlLang);
                solutions.push({
                    language_id,
                    source_code: code,
                    problem_id: 0,
                });
            });
        }

        items.push({ problem, testcases, solutions });

        // 每处理完成一项更新进度，并每 10 项让出控制权，保证界面更新
        if (onProgress) {
            onProgress(i + 1, total);
        }
        if ((i + 1) % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    return {
        version,
        items,
        ...(generator ? { generator } : {}),
        ...(urlAttr ? { url: urlAttr } : {})
    };
}

/**
 * 通过 FileReader 异步读取用户上传的 XML 文件，并解析为 FPS 对象（直接解析为 ProblemInfo、Testcase、Solution）
 * @param file 上传的 XML 文件
 */
export function parseFpsFile(file: File): Promise<{
    version: string;
    items: {
        problem: ProblemInfo;
        testcases: Testcase[];
        solutions: Solution[];
    }[];
    generator?: { name: string; url?: string };
    url?: string;
}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const text = reader.result as string;
                const fps = await parseFpsXml(text);
                resolve(fps);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsText(file);
    });
} 