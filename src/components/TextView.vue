<template>
    <div v-html="renderedMarkdown" :style="customStyle" class="markdown-content-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, computed } from 'vue';
import { renderMarkAndLaTeX } from '../utils/renderMarkAndLaTeX';

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
    renderedMarkdown.value = await renderMarkAndLaTeX(newContent);
});
</script>

<!-- 去除scoped，否则markdown样式无法生效 -->
<style>
.markdown-content-container {
    max-width: 100%;
    overflow: auto;
    white-space: pre-wrap;
}

.markdown-content-container img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
}

.markdown-content-container p,
.markdown-content-container ul,
.markdown-content-container ol,
.markdown-content-container blockquote {
    margin: 0;
}

.markdown-content-container blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    border-left: 5px solid #ccc;
    background-color: #f9f9f9;
}

.markdown-content-container code {
    background-color: #f5f5f5;
    padding: 2px 0; /* 增加垂直方向上的内边距 */
}
</style>