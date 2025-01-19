<template>
    <ElCheckTag v-for="difficulty in options" :key="difficulty.value" :checked="difficulty.checked"
        :label="difficulty.label" type="primary" @change="handleTagChange(difficulty.value)" style="margin-right: 1px;">
        {{ difficulty.label }}
    </ElCheckTag>
</template>

<script setup lang="ts">
import { DifficultyMap } from '@/types/Problem';
import { ElCheckTag } from 'element-plus';
import type { PropType, Ref } from 'vue';
import { ref, watch } from 'vue';

const props = defineProps({
    difficulty: {
        type: String as PropType<string>,
        default: '',
    },
});

interface Option {
    value: number;
    label: string;
    checked: boolean;
}

const options: Ref<Option[]> = ref(
    Object.entries(DifficultyMap).map(([key, value]) => ({
        value: parseInt(key),
        label: value,
        checked: false,
    }))
);

const emit = defineEmits(['update:difficulty']);

const handleTagChange = (value: number) => {
    options.value.filter(difficulty => difficulty.value === value)
        .forEach(difficulty => (difficulty.checked = !difficulty.checked));
    const arrayStr = options.value.filter(difficulty => difficulty.checked)
        .map(difficulty => difficulty.value.toString()).join(',');
    emit('update:difficulty', arrayStr);
};

watch(
    () => props.difficulty,
    (newDifficulty) => {
        const difficultyArray = newDifficulty === '' ? [] : newDifficulty.split(',').map(Number);
        options.value.forEach((option) => {
            option.checked = difficultyArray.includes(option.value);
        });
    },
    { immediate: true }
);

const reset = () => {
    options.value.forEach((option) => {
        option.checked = false;
    });
    emit('update:difficulty', '');
};

defineExpose({
    reset,
});
</script>