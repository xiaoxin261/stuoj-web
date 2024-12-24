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
            <ElInputNumber v-model="value.value_size_id" :step="1" size="small">
                <template #prefix>
                    <span>sizeID</span>
                </template>
            </ElInputNumber>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElButton, ElInputNumber, ElSwitch } from 'element-plus';
import { ref, watchEffect, type PropType } from 'vue';
import { Type, type Value } from '@/types/Problem';

const props = defineProps({
    value: {
        type: Object as PropType<Value>,
        required: true
    },
});

const emit = defineEmits(['update:value', 'delete']);

const handleDelete = () => {
    emit('delete');
};

const value = ref<Value>(props.value);

const min = ref(0);
const minIdFlag = ref(false);
const max = ref(0);
const maxIdFlag = ref(false);
const typeFlag = ref(true);

watchEffect(() => {
    value.value = {
        type: typeFlag.value ? Type.Int : Type.Float,
        value_size_id: value.value.value_size_id,
        min: minIdFlag.value ? undefined : min.value,
        max: maxIdFlag.value ? undefined : max.value,
        min_id: minIdFlag.value ? min.value : undefined,
        max_id: maxIdFlag.value ? max.value : undefined
    };
    emit('update:value', value.value);
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