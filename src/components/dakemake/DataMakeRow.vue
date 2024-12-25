<template>
    <div class="data-make-row">
        <div class="row-operation">
            <ElInputNumber v-model="row.row_size_id" controls-position="right" size="small" class="number-input">
                <template #prepend>
                    <span>sizeID</span>
                </template>
            </ElInputNumber>
            <ElButton type="primary" size="small" icon="CirclePlus" @click="addValue" />
            <ElButton type="primary" size="small" icon="Delete" @click="handleDelete" />
        </div>
        <div class="value-row">
            <DataMakeValue v-for="(id, index) in valueId" :key="index" :id="id" @delete="removeValue()"
                @update="updateValue()" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElInputNumber } from 'element-plus';
import { ref, type PropType, watchEffect, watch, toRef, onMounted, computed } from 'vue';
import { Type, type Row } from '@/types/Problem';
import { datamakeStore } from '@/stores/datamake';

const { CreateValue, UpdateRow, GetRow, DeleteRow, GetValueIds } = datamakeStore();

const props = defineProps<{
    id: string,
}>();

const valueId = ref<string[]>([]);

const row = ref<Row>({ row_size_id: 0, values: [] });

const emit = defineEmits(['update', 'delete']);

onMounted(() => {
    row.value = GetRow(props.id);
    valueId.value = GetValueIds(props.id);
});


const handleDelete = () => {
    DeleteRow(props.id);
    emit('delete');
};

const addValue = () => {
    CreateValue(props.id);
    valueId.value = GetValueIds(props.id);
    updateValue();
};

const removeValue = () => {
    valueId.value = GetValueIds(props.id);
    updateValue();
};

const updateValue = () => {
    valueId.value = [];
    valueId.value = GetValueIds(props.id);
    row.value = GetRow(props.id);
};

const idRef = toRef(props, 'id');

watch(idRef, () => {
    updateValue();
});

const rowSizeId = computed(() => row.value.row_size_id);

watch(rowSizeId, () => {
    const row_ = GetRow(props.id);
    UpdateRow(props.id, { ...row.value, globalId: row_?.globalId });
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