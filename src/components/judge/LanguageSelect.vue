<template>
    <ElSelect v-model="selectedId" @change="handleSelectChange" :clearable="clearable" :placeholder="placeholder"
        ref="selectRef">
        <ElOption v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
            {{ item.name }}</ElOption>
    </ElSelect>
</template>

<script setup lang="ts">
import type { Language } from '@/types/Judge';
import { onBeforeMount, ref, watchEffect, type PropType } from 'vue';
import { langStore } from '@/stores/language';
import { ElSelect } from 'element-plus';

const { getLanguages } = langStore();
const options = ref<Language[]>([]);

const props = defineProps({
    lang: {
        type: Object as PropType<Language>,
        default: null,
    },
    id: {
        type: Number as PropType<number>,
        default: null,
    },
    clearable: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    placeholder: {
        type: String as PropType<string>,
        default: '请选择语言'
    }
});

const selectedId = ref(props.id);

const selectedValue = ref(props.lang);

const selectRef = ref<InstanceType<typeof ElSelect>>();

onBeforeMount(async () => {
    options.value = (await getLanguages()).value;
});
const emit = defineEmits(['update:lang', 'update:id']);
const handleSelectChange = (value: number) => {
    selectedValue.value = options.value.find((item) => item.id === value) as Language;
    emit('update:lang', selectedValue.value);
    emit('update:id', value);
};

watchEffect(() => {
    selectedValue.value = props.lang;
});


const reset = () => {
    if (selectRef.value) {
        selectRef.value.handleClearClick(new Event('clear'));
    }
    emit('update:id', selectedId.value);
    emit('update:lang', selectedValue.value);
};

defineExpose({
    reset,
});

</script>