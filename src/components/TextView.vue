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
}

.markdown-content-container img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
}
</style>