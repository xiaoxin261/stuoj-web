<template>
    <ElForm :model="params">
        <ElFormItem :inline="true">
            <ElInput class="form-item-input" v-model="params.problem" placeholder="题目ID" clearable />&nbsp;
            <ElInput class="form-item-input" v-model="params.user" placeholder="用户ID" clearable />&nbsp;
            <ElSwitch v-model="params.exclude_history" size="small" active-text="排除题目编辑者" />
        </ElFormItem>
        <ElFormItem label-position="top">
            <TimeSelect v-model:time="params['start-time']" placeholder="开始时间" margin="1px" ref="startTimeRef" />
            <span style="margin: 0 10px;">-</span>
            <TimeSelect v-model:time="params['end-time']" placeholder="结束时间" margin="1px" ref="endTimeRef" />
        </ElFormItem>
        <ElFormItem label-position="left">
            <JudgeStatusSelect class="form-item-input" v-model:status="params.status" />&nbsp;
            <LanguageSelect class="form-item-input" clearable placeholder="编程语言" style="width: 240px;" v-model:id="params.language" ref="languageRef" />
        </ElFormItem>
        <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleConfirm">查询</el-button>
        </el-form-item>
    </ElForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type RecordParams } from '@/types/Record';
import TimeSelect from '../form/TimeSelect.vue';
import LanguageSelect from '../judge/LanguageSelect.vue';
import { ElSwitch } from 'element-plus';

const props = withDefaults(defineProps<{
    params: RecordParams
}>(), {
    params: () => ({ page: 1, size: 20 })
});

const params = ref<RecordParams>(props.params);
const emit = defineEmits(['update:params','confirmClicked']);

const startTimeRef = ref<InstanceType<typeof TimeSelect>>();
const endTimeRef = ref<InstanceType<typeof TimeSelect>>();
const languageRef = ref<InstanceType<typeof LanguageSelect>>();

const handleReset = () => {
    params.value = {
        page: 1,
        size: 20
    };
    emit('update:params', params.value);
    startTimeRef.value?.reset();
    endTimeRef.value?.reset();
    languageRef.value?.reset();
};

const handleConfirm = () => {
    emit('update:params', params.value);
    emit('confirmClicked');
};

</script>

<style scoped>
.form-item-input {
    width: 240px;
    margin-right: 1px;
}
</style>