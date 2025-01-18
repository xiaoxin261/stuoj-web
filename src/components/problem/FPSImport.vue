<template>
    <ElButton plain @click="showDialog">
        导入FPS
    </ElButton>
    <ElDialog v-model="dialogVisible" width="80%"><template #header="{ titleClass }">
            <div class="fps-header">
                <h4 :class="titleClass">导入FPS</h4>
                <el-button type="primary" @click="handleClickSelectFile">
                    <el-icon>
                        <Document />
                    </el-icon>
                    选择FPS文件
                </el-button>
            </div>
            <input ref="fileInput" type="file" accept=".xml" style="display: none;" @change="onFileChange" />
        </template>
        <ElRow :gutter="20">
            <ElCol :span="18">
                <ElDescriptions border class="fps-info" :column="2" label-width="80px" style="margin-bottom: 10px;">
                    <ElDescriptionsItem label="题目" :span="2">{{ fpsSelect?.problem.title }}</ElDescriptionsItem>
                    <ElDescriptionsItem label="描述" :span="2">{{ fpsSelect?.problem.description }}</ElDescriptionsItem>
                    <ElDescriptionsItem label="输入格式" :span="2">{{ fpsSelect?.problem.input }}</ElDescriptionsItem>
                    <ElDescriptionsItem label="输出格式" :span="2">{{ fpsSelect?.problem.output }}</ElDescriptionsItem>
                    <ElDescriptionsItem label="样例输入" :span="2">{{ fpsSelect?.problem.sample_input }}
                    </ElDescriptionsItem>
                    <ElDescriptionsItem label="样例输出" :span="2">{{ fpsSelect?.problem.sample_output }}
                    </ElDescriptionsItem>
                    <ElDescriptionsItem label="时间">{{ fpsSelect?.problem.time_limit }}s</ElDescriptionsItem>
                    <ElDescriptionsItem label="内存">{{ fpsSelect?.problem.memory_limit || 0 / 1024 }}MB
                    </ElDescriptionsItem>
                </ElDescriptions>
                <ElTable :data="fpsSelect?.testcases" border class="fps-testcases" max-height="300" stripe
                    style="margin-bottom: 10px;">
                    <ElTableColumn label="序号" type="index" width="55" />
                    <ElTableColumn label="输入" prop="test_input" />
                    <ElTableColumn label="输出" prop="test_output" />
                </ElTable>
                <ElTable :data="fpsSelect?.solutions" border class="fps-solution" max-height="300" stripe>
                    <ElTableColumn label="语言" width="100">
                        <template #default="scope">
                            <LanguageShow :langId="scope.row?.language_id || 0" />
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="代码" prop="source_code" />
                </ElTable>
            </ElCol>
            <ElCol :span="6">
                <ElTable :data="fps" :key="certinfoKey" highlight-current-row @current-change="handleCurrentChange"
                    max-height="500" stripe>
                    <ElTableColumn label="序号" type="index" width="55" />
                    <ElTableColumn label="题目" prop="problem.title" />
                    <ElTableColumn label="测试" prop="testcases.length" width="55" />
                    <ElTableColumn label="题解" prop="solutions.length" width="55" />
                </ElTable>
            </ElCol>
        </ElRow>
        <template #footer>
            <div class="fps-footer">
                <ElButton @click="dialogVisible = false">取消</ElButton>
                <ElButton type="primary" @click="importFPS">
                    提交
                </ElButton>
            </div>
        </template>

    </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElNotification } from 'element-plus';
import { uploadFPSApi } from '@/apis/problem';
import type { FpsProblemInfo, FpsSolution, FpsTestcase, ProblemInfo, Solution, Testcase } from "@/types/Problem";
import LanguageShow from '@/LanguageShow.vue';

const props = defineProps<{
    problem?: ProblemInfo;
    testcases?: Testcase[];
    solutions?: Solution[];
}>();

const emit = defineEmits(['update:problem', 'update:testcases', 'update:solutions', 'import-fps']);

const { execute } = uploadFPSApi();

const dialogVisible = ref(false);

const showDialog = () => {
    dialogVisible.value = true;
};

const fileInput = ref<HTMLInputElement | null>(null);

const handleClickSelectFile = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const fps = ref<{ problem: FpsProblemInfo, solutions: FpsSolution[], testcases: FpsTestcase[] }[]>();
const fpsSelect = ref<{ problem: FpsProblemInfo, solutions: FpsSolution[], testcases: FpsTestcase[] } | null>();

// 使用certinfoKey在submissions更新后让表格重新渲染，否则表格不会更新
const certinfoKey = ref(0);
const onFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) {
        return;
    };

    const file = files[0];
    if (file.type !== 'text/xml') {
        ElNotification({
            title: '错误',
            message: '请选择一个XML文件',
            type: 'error',
        });
        return;
    };

    const formData = new FormData();
    formData.append('file', file);

    await execute({
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: formData
    }).then((res) => {
        fps.value = res.value;
    });
    certinfoKey.value++;
};

const handleCurrentChange = (row: { problem: FpsProblemInfo, solutions: FpsSolution[], testcases: FpsTestcase[] }) => {
    fpsSelect.value = row;
    emit('update:problem', row.problem);
    emit('update:testcases', row.testcases);
    emit('update:solutions', row.solutions);
};

const importFPS = () => {
    emit('import-fps', fpsSelect.value);
    dialogVisible.value = false;
};
</script>

<style scoped>
.fps-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.fps-footer {
    display: flex;
    justify-content: flex-end;
}
.fps-info{
    width: 100%;
    overflow: auto;
}
</style>