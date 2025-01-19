<template>
    <ElCheckTag v-for="map in options" :key="map.value" :checked="map.checked"
        :label="map.label" type="primary" @change="handleTagChange(map.value)" style="margin-right: 1px;">
        {{ map.label }}
    </ElCheckTag>
</template>

<script setup lang="ts">
import { ElCheckTag } from 'element-plus';
import type { PropType, Ref } from 'vue';
import { ref, watch } from 'vue';

const props = defineProps({
    arrStr: {
        type: String as PropType<string>,
        default: '',
    },
    strMap: {
        type: Object as PropType<Record<number, string>>,
        required: true,
    },
});

interface Option {
    value: number;
    label: string;
    checked: boolean;
}

const options: Ref<Option[]> = ref(
    Object.entries(props.strMap).map(([key, value]) => ({
        value: parseInt(key),
        label: value,
        checked: false,
    }))
);

const emit = defineEmits(['update:arrStr']);

const handleTagChange = (value: number) => {
    options.value.filter(difficulty => difficulty.value === value)
        .forEach(difficulty => (difficulty.checked = !difficulty.checked));
    const arrayStr = options.value.filter(difficulty => difficulty.checked)
        .map(difficulty => difficulty.value.toString()).join(',');
    emit('update:arrStr', arrayStr);
};

watch(
    () => props.arrStr,
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
    emit('update:arrStr', '');
};

defineExpose({
    reset,
});
</script>