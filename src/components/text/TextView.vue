<template>
    <div v-html="renderedMarkdown" :style="customStyle" class="markdown-content-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, computed, nextTick } from 'vue';
import mdi from '@/utils/renderMarkDown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const props = defineProps<{
    content: string,
    fontSize?: string,
    letterSpacing?: string,
    lineHeight?: string
}>();

const markdown = ref<string>(props.content);
const renderedMarkdown = ref<string>('');

const customStyle = computed(() => ({
    fontSize: props.fontSize || '18px',
    letterSpacing: props.letterSpacing || 'normal',
    lineHeight: props.lineHeight || 'normal'
}));

watch(() => props.content, async (newContent) => {
    markdown.value = newContent;
    renderedMarkdown.value = await mdi.render(newContent);
    nextTick(() => {
        document.querySelectorAll('code').forEach((block) => {
            return hljs.highlightBlock(block as HTMLElement);
        });
    });
});
</script>

<!-- 去除scoped，否则markdown样式无法生效 -->
<style>
.markdown-content-container p{
    margin: 0;
}
.markdown-content-container code {
    padding: 0;
    position: relative;
    background-color: #2d2d2d; /* 设置黑色背景 */
}

.markdown-content-container pre {
    padding: 0;
    position: relative;
    padding-left: 40px; /* 为行号预留空间 */
    background-color: #2d2d2d; /* 设置黑色背景 */
    color: #ddd;
}

.markdown-content-container pre code {
    padding: 0;
    display: block;
    background-color: transparent; /* 使代码块背景透明 */
    overflow-x: auto;
}
</style>