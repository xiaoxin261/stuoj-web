<template>
    <ElCheckTag v-for="difficulty in options" :key="difficulty.value" :checked="difficulty.checked"
        :label="difficulty.label" type="primary" @change="handleTagChange(difficulty.value)" style="margin-right: 1px;">
        {{ difficulty.label }}
    </ElCheckTag>
</template>

<script setup lang="ts">
import { ProblemStatusMap } from '@/types/Problem';
import { ElCheckTag } from 'element-plus';
import type { PropType, Ref } from 'vue';
import { ref, watch } from 'vue';

const props = defineProps({
    status: {
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
    Object.entries(ProblemStatusMap).map(([key, value]) => ({
        value: parseInt(key),
        label: value,
        checked: false,
    }))
);

const emit = defineEmits(['update:status']);

const handleTagChange = (value: number) => {
    options.value.filter(status => status.value === value)
        .forEach(status => (status.checked = !status.checked));
    const arrayStr = options.value.filter(status => status.checked)
        .map(status => status.value.toString()).join(',');
    emit('update:status', arrayStr);
};

watch(
    () => props.status,
    (newStatus) => {
        const difficultyArray = newStatus.split(',').map(Number);
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
    emit('update:status', '');
};

defineExpose({
    reset,
});
</script>