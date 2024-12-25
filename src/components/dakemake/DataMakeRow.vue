<template>
    <div class="data-make-row">
        <div class="row-operation">
            <ElInputNumber v-model="row.value_size_id" controls-position="right" size="small" class="number-input">
                <template #prepend>
                    <span>sizeID</span>
                </template>
            </ElInputNumber>
            <ElButton type="primary" size="small" icon="CirclePlus" @click="addValue" />
            <ElButton type="primary" size="small" icon="Delete" @click="handleDelete" />
        </div>
        <div class="value-row">
            <DataMakeValue v-for="(_, index) in row.values" :key="index" v-model:value="row.values[index]"
                @delete="removeValue(index)" ref="valueRefs" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElInputNumber } from 'element-plus';
import { ref, type PropType, watchEffect, nextTick } from 'vue';
import { Type, type Row } from '@/types/Problem';
import DataMakeValue from './DataMakeValue.vue';

const props = defineProps({
    row: {
        type: Object as PropType<Row>,
        required: true
    },
});

const row = ref(props.row);

const emit = defineEmits(['update:row', 'delete']);

const valueRefs = ref<InstanceType<typeof DataMakeValue>[]>([]);

const handleDelete = () => {
    emit('delete');
};

const addValue = async () => {
    row.value.values.push({
        type: Type.Int,
        value_size_id: undefined,
        min: undefined,
        max: undefined,
        min_id: undefined,
        max_id: undefined
    });
};

const removeValue = (index: number) => {
    if (index >= 0 && index < row.value.values.length) {
        row.value.values.splice(index, 1);
        nextTick(() => {
            valueRefs.value.forEach((comp) => {
                comp.getFromProps();
            });
        });
    } else {
        console.warn('Index out of bounds');
    }
};

const getFromProps = () => {
    row.value = props.row;
    nextTick(() => {
        valueRefs.value.forEach((comp) => {
            comp.getFromProps();
        });
    });
};

defineExpose({
    getFromProps,
});

watchEffect(() => {
    emit('update:row', row.value);
});
</script>

<style scoped>
.data-make-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}

.row-operation {
    display: flex;
    gap: 10px;
}

.value-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>