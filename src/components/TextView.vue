<template>
    <div v-html="renderedMarkdown" :style="customStyle"></div>
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