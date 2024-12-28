<template>
    <ElSelect v-model="selectedValue.id" @change="handleSelectChange">
        <ElOption v-for="item in options" :key="item.id" :label="item.name" :value="item.id">{{ item.name }}</ElOption>
    </ElSelect>
</template>

<script setup lang="ts">
import { GetLanguages } from '@/apis/judge';
import type { Language } from '@/types/Judge';
import {  onMounted, ref, watchEffect } from 'vue';

const { execute, state } = GetLanguages();
const options = ref<Language[]>([]);

const props = defineProps<{
    lang: Language;
}>();

const selectedValue = ref(props.lang);

onMounted(async () => {
    await execute();
    if (state.value) {
        options.value = state.value;
    }
});
const emit = defineEmits(['update:lang']);
const handleSelectChange = (value: number) => {
    selectedValue.value = options.value.find((item) => item.id === value) as Language;
    emit('update:lang', selectedValue.value);
};

watchEffect(() => {
    selectedValue.value = props.lang;
});

</script>