<template>
    <ElSelect v-model="selectedId" @change="handleSelectChange" :clearable="clearable" :placeholder="placeholder">
        <ElOption v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
            {{ item.name }}</ElOption>
    </ElSelect>
</template>

<script setup lang="ts">
import type { Language } from '@/types/Judge';
import { onBeforeMount, ref, watchEffect, type PropType } from 'vue';
import { langStore } from '@/stores/language';

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

</script>