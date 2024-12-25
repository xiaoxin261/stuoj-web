<template>
    <div class="data-make">
        <h4>数据生成器</h4>
        <ElButton type="primary" @click="addRow">添加行</ElButton>
        <DataMakeRow v-for="(id, index) in rowId" :key="index" :id="id" @delete="removeRow()" @update="updateRow()" />
        <ElButton type="primary" @click="handleGenerate">生成</ElButton>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import type { Global } from '@/types/Problem';
import { datamakeStore } from '@/stores/datamake';

const { GetGlobal, CreateRow, CreateGlobal, GetRowIds } = datamakeStore();

const rowId = ref<string[]>([]);

const id = ref('');
const addRow = () => {
    CreateRow(id.value);
    global.value = GetGlobal(id.value);
    updateRow();
};

const global = ref<Global>();

const removeRow = () => {
    updateRow();
    global.value = GetGlobal(id.value);
};

const updateRow = () => {
    rowId.value = [];
    rowId.value = GetRowIds(id.value);
    global.value = GetGlobal(id.value);
};

const handleGenerate = () => {
    global.value = GetGlobal(id.value);
    console.log(global.value);
};

onMounted(() => {
    id.value = CreateGlobal();
    global.value = GetGlobal(id.value);
});

</script>

<style scoped></style>