<template>
    <ElForm :model="params">
        <ElFormItem :inline="true">
            <ElInput class="form-item-input" v-model="params.blog" placeholder="博客ID" clearable />&nbsp;
            <ElInput class="form-item-input" v-model="params.user" placeholder="用户ID" clearable />
        </ElFormItem>
        <ElFormItem label-position="top">
            <TimeSelect v-model:time="params['start-time']" placeholder="开始时间" margin="1px" ref="startTimeRef" />
            <span style="margin: 0 10px;">-</span>
            <TimeSelect v-model:time="params['end-time']" placeholder="结束时间" margin="1px" ref="endTimeRef" />
        </ElFormItem>
        <ElFormItem label-position="left">
            <JudgeStatusSelect class="form-item-input" v-model:status="params.status" />&nbsp;
        </ElFormItem>
        <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleConfirm">查询</el-button>
        </el-form-item>
    </ElForm>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import type { commentParams } from '@/types/Comment';
import TimeSelect from '../form/TimeSelect.vue';

const props = defineProps({
    params: {
        type: Object as PropType<commentParams>,
        default: () => ({})
    }
});

const params = ref<commentParams>({
    ...props.params
});
const emit = defineEmits(['update:params', 'confirmClicked']);

const startTimeRef = ref<InstanceType<typeof TimeSelect>>();
const endTimeRef = ref<InstanceType<typeof TimeSelect>>();
const handleReset = () => {
    params.value = {
        page: 1,
        size: 20
    };
    emit('update:params', params.value);
    startTimeRef.value?.reset();
    endTimeRef.value?.reset();
};

const handleConfirm = () => {
    emit('update:params', params.value);
    emit('confirmClicked');
};
</script>