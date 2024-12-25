<template>
    <div class="data-make">
        <h4>数据生成器</h4>
        <ElButton type="primary" @click="addRow">添加行</ElButton>
        <DataMakeRow v-for="(_, index) in global.rows" :key="index" v-model:row="global.rows[index]" :index="index"
            @delete="removeRow(index)" ref="rowRefs"/>
        <ElButton type="primary" @click="handleGenerate">生成</ElButton>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, nextTick } from 'vue';
import type { Global } from '@/types/Problem';
import DataMakeRow from './DataMakeRow.vue';

const props = defineProps<{ global: Global }>();

const emit = defineEmits(['update:global']);

const global = ref<Global>(props.global);

const rowRefs = ref<InstanceType<typeof DataMakeRow>[]>([]);

const addRow = () => {
    global.value.rows.push({ row_size_id: 0, values: [] });
};

const removeRow = (index: number) => {
    if (index >= 0 && index < global.value.rows.length) {
        global.value.rows.splice(index, 1);
        nextTick(() => {
            rowRefs.value.forEach((comp) => {
                comp.getFromProps();
            });
        });
    } else {
        console.warn('Index out of bounds');
    }
};

watchEffect(() => {
    emit('update:global', global.value);
});

const handleGenerate = () => {
    console.log(global.value);
};
</script>

<style scoped></style>