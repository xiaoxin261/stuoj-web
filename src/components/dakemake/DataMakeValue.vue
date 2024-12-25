<template>
    <div class="value-input">
        <div class="input-container">
            <div class="number-input">
                <ElInputNumber v-model="min" :step="1" size="small">
                    <template #prefix>
                        <span>min</span>
                    </template>
                </ElInputNumber>
                <ElSwitch v-model="minIdFlag" width="50" size="small" inline-prompt active-text="id"
                    inactive-text="value" />
            </div>
            <div class="number-input">
                <ElInputNumber v-model="max" :step="1" size="small">
                    <template #prefix>
                        <span>max</span>
                    </template>
                </ElInputNumber>
                <ElSwitch v-model="maxIdFlag" width="50" size="small" inline-prompt active-text="id"
                    inactive-text="value" />
            </div>
        </div>
        <div class="input-container">
            <div class="type-input">
                <ElSwitch v-model="typeFlag" width="50" size="small" inline-prompt active-text="int"
                    inactive-text="float" />
                <ElButton size="small" type="danger" @click="handleDelete" icon="Delete" />
            </div>
            <ElInputNumber v-model="value_size_id" :step="1" size="small">
                <template #prefix>
                    <span>sizeID</span>
                </template>
            </ElInputNumber>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElButton, ElInputNumber, ElSwitch } from 'element-plus';
import { onMounted, ref, toRef, watch, watchEffect, type PropType } from 'vue';
import { Type, type Value } from '@/types/Problem';
import { datamakeStore } from '@/stores/datamake';

const { UpdateValue, GetValue, DeleteValue } = datamakeStore();

const props = defineProps<{
    id: string,
}>();

const emit = defineEmits(['update', 'delete']);

const handleDelete = () => {
    DeleteValue(props.id);
    emit('delete');
};

const value = ref<Value>({
    value_size_id: 0,
    type: Type.Int,
});

let updateFlag = true;

const min = ref(0);
const minIdFlag = ref(false);
const max = ref(0);
const maxIdFlag = ref(false);
const typeFlag = ref(true);
const value_size_id = ref(0);

const idRef = toRef(props, 'id');

watch(idRef, () => {
    updateFlag = false;
    const value_ = GetValue(props.id);
    if (value_ === undefined) {
        return;
    }
    value.value = value_;
    min.value = value.value?.min ?? value.value?.min_id ?? 0;
    minIdFlag.value = value.value?.min_id !== undefined;
    max.value = value.value?.max ?? value.value?.max_id ?? 0;
    maxIdFlag.value = value.value?.max_id !== undefined;
    value_size_id.value = value.value?.value_size_id ?? 0;
    typeFlag.value = value.value?.type === Type.Int;
    updateFlag = true;
});

watchEffect(() => {
    if (!updateFlag) {
        return;
    }
    const value_ = GetValue(props.id);
    value.value = {
        type: typeFlag.value ? Type.Int : Type.Float,
        value_size_id: value_size_id.value,
        min: minIdFlag.value ? undefined : min.value,
        max: maxIdFlag.value ? undefined : max.value,
        min_id: minIdFlag.value ? min.value : undefined,
        max_id: maxIdFlag.value ? max.value : undefined
    };
    UpdateValue(props.id, { ...value.value, rowId: value_?.rowId });
    value.value = GetValue(props.id) ?? value.value;
    emit('update');
});

</script>

<style scoped>
.value-input {
    display: flex;
    flex-direction: row;
}

.input-container {
    display: flex;
    flex-direction: column;
}

.number-input {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.type-input {
    display: flex;
    justify-content: space-between;
}
</style>