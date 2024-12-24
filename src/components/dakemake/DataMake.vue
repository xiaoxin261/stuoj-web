<template>
    <div class="data-make">
        <h4>数据生成器</h4>
        <ElButton type="primary" @click="addRow">添加行</ElButton>
        <DataMakeRow v-for="(_, index) in global.rows" :key="index" v-model:row="global.rows[index]" :index="index"
            @delete="removeRow(index)" />
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Global } from '@/types/Problem';

const props = defineProps<{ global: Global }>();

const emit = defineEmits(['update:global']);

const global = ref<Global>(props.global);

const addRow = () => {
    console.log(global.value.rows);
    global.value.rows.push({ values: [] });
};

const removeRow = (index: number) => {
    if (index >= 0 && index < global.value.rows.length) {
        global.value.rows.splice(index, 1);
    } else {
        console.warn('Index out of bounds');
    }
};

watchEffect(() => {
    emit('update:global', global.value);
});
</script>

<style scoped></style>