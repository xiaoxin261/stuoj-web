<template>
    <el-select v-model="lang" filterable allow-create default-first-option :reserve-keyword="false"
        placeholder="Choose tags for your article" style="width: 240px" @change="handleSelectChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
    lang: string
}>();

const emit=defineEmits(['update:lang']);

const handleSelectChange = (value: string) => {
    emit('update:lang', value);
}

const lang = ref<string[]>([]);
const options = [
    {
        value: 'zh-CN',
        label: '中文',
    },
    {
        value: 'en-US',
        label: '英文',
    },
    {
        value: 'es-ES',
        label: '西班牙语',
    },
    {
        value: 'ja-JP',
        label: '日语',
    },
    {
        value: 'ko-KR',
        label: '韩语',
    },
    {
        value: 'fr-FR',
        label: '法语',
    },
    {
        value: 'ru-RU',
        label: '俄语',
    },
    {
        value: 'de-DE',
        label: '德语',
    },
    {
        value: 'pt-BR',
        label: '葡萄牙语',
    },
    {
        value: 'it-IT',
        label: '意大利语',
    }
];
</script>