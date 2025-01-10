<template>
    <el-select clearable v-model="selectedValue" placeholder="请选择状态" @change="handleSelectChange" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ProblemStatusMap } from '@/types/Problem';
import { ref, defineProps, defineEmits, watch, type PropType } from 'vue';
const props = defineProps({
    status: {
        type: Number as PropType<number | undefined>,
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

const selectedValue = ref(props.status);

const emit = defineEmits(['update:status']);

const handleSelectChange = (value: number) => {
    selectedValue.value = value;
    emit('update:status', value);
};

watch(() => props.status, (newValue) => {
    selectedValue.value = newValue;
});

const reset = () => {
    selectedValue.value = undefined;
    emit('update:status', null);
};
defineExpose({
    reset,
});
</script>