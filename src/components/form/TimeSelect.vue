<template>
    <ElDatePicker v-model="timeC" type="date" :placeholder="placeholder"
        :disabled-date="props.future ? () => false : futureDate" clearable />
    <ElTimePicker :style="{ marginLeft: props.margin }" v-model="timeC" type="time" :placeholder="placeholder"
        :disabled-date="props.future ? () => false : futureDate" clearable />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDateTimeStr } from '@/utils/date';
import { futureDate } from '@/utils/date';

const props = withDefaults(defineProps<{
    time: string | undefined
    future?: boolean
    placeholder?: string
    margin?: string
}>(), {
    future: false,
    placeholder: '请选择时间',
    margin: '5px'
});

const emit = defineEmits(['update:time'])
const time = ref(props.time);

const timeC = computed({
    get: () => {
        return time.value;
    },
    set: (value: string) => {
        time.value = formatDateTimeStr(value);
        emit('update:time', time.value);
    }
});

const reset = () => {
    time.value = undefined;
    emit('update:time', time.value);
};

defineExpose({
    reset,
});

</script>