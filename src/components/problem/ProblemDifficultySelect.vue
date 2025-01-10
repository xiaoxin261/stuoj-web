<template>
    <el-select clearable v-model="selectedValue" placeholder="请选择难度" @change="handleSelectChange" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, type PropType } from 'vue';
import { DifficultyMap } from '@/types/Problem';
const props = defineProps({
    difficulty: {
        type: Number as PropType<number | undefined>,
        default: undefined,
    },
});

const generateOptions = (): { value: number; label: string }[] => {
    return Object.entries(DifficultyMap).map(([key, value]) => {
        return {
            value: parseInt(key),
            label: value,
        };
    });
};

const options = generateOptions();

const selectedValue = ref(props.difficulty);

const emit = defineEmits(['update:difficulty']);

const handleSelectChange = (value: number) => {
    selectedValue.value = value;
    emit('update:difficulty', value);
};

watch(() => props.difficulty, (newValue) => {
    selectedValue.value = newValue;
});
const reset = () => {
    selectedValue.value = undefined;
    emit('update:difficulty', selectedValue.value);
};
defineExpose({
    reset,
});
</script>