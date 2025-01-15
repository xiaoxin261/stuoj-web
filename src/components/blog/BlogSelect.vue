<template>
    <div class="blog-select-button" style="margin-bottom: 5px; text-align: right;">
        <ElButton style="width: 30px;" plain :icon="Operation" @click="showCard = !showCard"></ElButton>
    </div>
    <ElCard v-show="showCard" style="margin-bottom: 5px;">
        <ElForm :model="params">
            <ElFormItem :inline="true">
                <ElInput class="form-item-input" v-model="params.problem" placeholder="题目ID" clearable />&nbsp;
                <ElInput class="form-item-input" v-model="params.user" placeholder="用户ID" clearable />
            </ElFormItem>
            <ElFormItem label-position="top">
                <TimeSelect v-model:time="params['start-time']" placeholder="开始时间" margin="1px" ref="startTimeRef" />
                <span style="margin: 0 10px;">-</span>
                <TimeSelect v-model:time="params['end-time']" placeholder="结束时间" margin="1px" ref="endTimeRef" />
            </ElFormItem>
            <ElFormItem label-position="left">
                <BlogStatusSelect class="form-item-input" v-model:status="params.status" clearable />&nbsp;
            </ElFormItem>
            <ElFormItem>
                <OrderSelect :exclude="[OrderBy.blog]" v-model:order-by="params.order_by" v-model:order="params.order"
                    ref="orderRef" />
            </ElFormItem>
            <el-form-item>
                <el-button @click="handleReset">重置</el-button>
                <el-button type="primary" @click="handleConfirm">查询</el-button>
            </el-form-item>
        </ElForm>
    </ElCard>
</template>

<script setup lang="ts">
import type { BlogParams } from '@/types/Blog';
import { Operation } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import { ref, type PropType } from 'vue';
import TimeSelect from '../form/TimeSelect.vue';
import OrderSelect from '../OrderSelect.vue';
import { OrderBy } from '@/types/misc';

const startTimeRef = ref<InstanceType<typeof TimeSelect>>();
const endTimeRef = ref<InstanceType<typeof TimeSelect>>();
const orderRef = ref<InstanceType<typeof OrderSelect>>();

const showCard = ref(false);

const props = defineProps({
    params: {
        type: Object as PropType<BlogParams>,
        default: () => ({}),
    },
});

const params = ref<BlogParams>(props.params);

const emit = defineEmits(['update:params', 'confirmClicked']);
const handleReset = () => {
    params.value = {
        page: 1,
        size: 20
    };
    emit('update:params', params.value);
    startTimeRef.value?.reset();
    endTimeRef.value?.reset();
    orderRef.value?.reset();
};

const handleConfirm = () => {
    console.log(params.value)

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