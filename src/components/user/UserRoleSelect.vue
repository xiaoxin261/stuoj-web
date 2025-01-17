<template>
    <ElSelect v-model="selectedValue" @change="handleSelectChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </ElSelect>
</template>

<script setup lang="ts">
import { Role, UserRoleMap } from '@/types/User';
import { ref, type PropType } from 'vue';

const props = defineProps({
    role: {
        type: Number as PropType<Role>,
        default: null,
    },
});

const selectedValue = ref<Role>(props.role);

const emit = defineEmits(['update:role']);

const handleSelectChange = (value: Role) => {
    emit('update:role', value);
};

const generateOptions = (): { value: Role; label: string }[] => {
    return Object.entries(UserRoleMap).map(([key, value]) => {
        return { value: Number(key), label: value };
    });
};

const options = generateOptions();

</script>