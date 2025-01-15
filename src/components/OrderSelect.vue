<template>
    <div style="display: flex;">
        <ElSelect clearable v-model="selectedValue" placeholder="排序" @change="handleSelectChange" style="width: 240px">
            <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>&nbsp;
        <ElButton @click="toggleOrder" :icon="orderIcon" style="width: 40px;"></ElButton>
    </div>
</template>

<script setup lang="ts">
import { OrderBy, OrderByMap } from "@/types/misc";
import { computed, ref, watch, type PropType } from "vue";
import { Top, Bottom } from "@element-plus/icons-vue";

const props = defineProps({
    orderBy: {
        type: Object as PropType<OrderBy | undefined>,
        default: null,
    },
    order: {
        type: String,
        default: "desc",
    },
    exclude:{
        type: Array as PropType<OrderBy[]>,
        default: () => []
    }
});

const emit = defineEmits(['update:orderBy', 'update:order']);

const generateOptions = (): { value: OrderBy; label: string }[] => {
    return Object.entries(OrderByMap).map(([key, value]) => {
        const orderByValue = key as unknown as OrderBy; // 强制类型转换
        return {
            value: orderByValue,
            label: value,
        };
    }).filter(option => !props.exclude.includes(option.value));
};
const options = generateOptions();

const selectedValue = ref(props.orderBy);

const handleSelectChange = (value: OrderBy) => {
    selectedValue.value = value;
    emit('update:orderBy', value);
    
};

watch(() => props.orderBy, (newValue) => {
    selectedValue.value = newValue;
});

const toggleOrder = () => {
    const newOrder = props.order === 'desc' ? 'asc' : 'desc';
    emit('update:order', newOrder);
};

const orderIcon = computed(() => {
    return props.order === 'desc' ? Bottom : Top;
});

const reset = () => {
    selectedValue.value = undefined;
    emit('update:orderBy', null);
    emit('update:order', 'desc');
};

defineExpose({
    reset,
});
</script>
