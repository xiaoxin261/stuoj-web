<template>
    <div>
        <div class="data-make-title">
            <h4>数据生成器</h4>
            <ElButton type="primary" @click="unfold">{{ unfoldFlag ? '收起' : '展开' }}</ElButton>
        </div>
        <div v-if="unfoldFlag" class="data-make">
            <ElButton type="primary" @click="addRow">添加行</ElButton>
            <DataMakeRow v-for="(_, index) in global.rows" :key="index" v-model:row="global.rows[index]" :index="index"
                @delete="removeRow(index)" ref="rowRefs" />
            <ElButton style="margin-top: 5px;" type="primary" @click="handleGenerate">生成</ElButton>
            <ElInput style="margin-top: 10px;" type="textarea" v-model:value="text" resize="vertical"
                :autosize="{ minRows: 4, maxRows: 20 }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, nextTick } from 'vue';
import type { Global } from '@/types/Problem';
import { datamakeApi } from '@/apis/problem';
import { userStore } from '@/stores/user';
import DataMakeRow from './DataMakeRow.vue';

const { token } = userStore();

const { execute } = datamakeApi();

const text = ref('');

const props = defineProps<{ global: Global }>();

const emit = defineEmits(['update:global']);

const global = ref<Global>(props.global);

const rowRefs = ref<InstanceType<typeof DataMakeRow>[]>([]);

const unfoldFlag = ref(false);

const unfold = () => {
    unfoldFlag.value = !unfoldFlag.value;
};

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
    execute({
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
        data: global.value
    }).then((res) => {
        if (res.value) {
            text.value = res.value;
        }
    });
};
</script>

<style scoped>
.data-make-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

</style>