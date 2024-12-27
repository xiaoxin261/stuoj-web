<template>
    <el-select clearable v-model="selectedValue" placeholder="请选择状态" @change="handleSelectChange" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ProblemStatusMap } from '@/types/Problem';
import { ref, defineProps, defineEmits, watch } from 'vue';
const props = defineProps({
    modelValue: {
        type: [Number],
        default: null,
    },
});

const generateOptions = (): { value: number; label: string }[] => {
    return Object.entries(ProblemStatusMap).map(([key, value]) => {
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

watch(() => props.modelValue, (newValue) => {
    selectedValue.value = newValue;
});
</script>