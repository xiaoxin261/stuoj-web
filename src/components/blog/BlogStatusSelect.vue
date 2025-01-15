<template>
    <el-select :clearable="clearable" v-model="selectedValue" placeholder="博客状态" @change="handleSelectChange" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled" />
    </el-select>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, type PropType } from 'vue';
import { userStore } from '@/stores/user';
import { BlogStatusMap, BlogStatus } from '@/types/Blog';
import { Role } from '@/types/User';

const { info } = userStore();

const props = defineProps({
    status: {
        type: Number as PropType<number | undefined>,
        default: null,
    },
    clearable: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
});

const generateOptions = (): { value: number; label: string, disabled: boolean }[] => {
    return Object.entries(BlogStatusMap).map(([key, value]) => {
        return {
            value: parseInt(key),
            label: value,
            disabled: (value === BlogStatusMap[BlogStatus.Banned] || value === BlogStatusMap[BlogStatus.Notice]) && info.value.role < Role.Admin,
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