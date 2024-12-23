<template>
    <el-select clearable v-model="selectedValue" placeholder="请选择难度" @change="handleSelectChange" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Difficulty, DifficultyMap } from '@/types/Problem';
const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: null,
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

const selectedValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

const handleSelectChange = (value: number) => {
    selectedValue.value = value;
    emit('update:modelValue', value);
};
const reset = () => {
    selectedValue.value = "";
    emit('update:modelValue', null);
};
defineExpose({
    reset,
});
</script>