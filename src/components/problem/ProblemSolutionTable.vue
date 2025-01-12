<template>
    <div class="solution-table">
        <div class="button-group">
            <ElButton type="info" @click="refreshSolutions" icon="Refresh" style="width: 80px;">刷新</ElButton>
            <ElButton type="primary" @click="addSolution" icon="CirclePlus">添加题解</ElButton>
        </div>
        <ElTable :data="solutions" style="width: 100%;" @current-change="handleCurrentChange" highlight-current-row
            stripe>
            <ElTableColumn label="语言">
                <template #default="scope">
                    <ElTooltip
                        :content="languages.find((lang: Language) => lang.id === scope.row.data.language_id)?.name || 'Unknown'">
                        <span class="ellipsis">{{ languages.find((lang: Language) => lang.id ===
                            scope.row.data.language_id)?.name || 'Unknown' }}</span>
                    </ElTooltip>
                </template>
            </ElTableColumn>
            <ElTableColumn label="脏位" prop="checked" width="65">
                <template #default="scope">
                    <ElTag style="margin-bottom: 10px;" size="large" :type="scope.row.checked ? 'warning' : 'info'">
                        <ElIcon v-if="scope.row.checked">
                            <Warning />
                        </ElIcon>
                        <ElIcon v-else>
                            <CircleCheck />
                        </ElIcon>
                    </ElTag>
                </template>
            </ElTableColumn>
            <ElTableColumn label="重置" width="60" #default="scope">
                <ElButton v-if="scope.row.data.id !== 0" type="danger" :icon="CircleCloseFilled"
                    @click="reset(scope.row.data.id)" style="width: 90%; height: 90%;" />
            </ElTableColumn>
            <ElTableColumn label="删除" width="60" #default="scope">
                <ElCheckbox v-model="scope.row.deleted" size="large" />
            </ElTableColumn>
        </ElTable>
        <ElButton type="primary" @click="uploadSolution" :icon="Upload" style="width: 100px; margin-top: 10px;">更新
        </ElButton>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
import { ElMessage, ElTableColumn, ElTag } from 'element-plus';
import { CircleCloseFilled, Warning, CircleCheck, Upload } from '@element-plus/icons-vue';
import type { Solution } from '@/types/Problem';
import { getSolutionApi, uploadSolutionApi, updateSolutionApi, deleteSolutionApi, getProblemApi } from '@/apis/problem';
import { GetLanguages } from '@/apis/judge';
import type { Language } from '@/types/Judge';
import { generateRandomHash } from '@/utils/hash';

const props = withDefaults(defineProps<{
    solution?: Solution,
    problemId?: number,
}>(), {
    problemId: 0,
});

const { execute: getProblemExecute } = getProblemApi();
const { execute: getSolutionExecute } = getSolutionApi();
const { execute: uploadSolutionExecute } = uploadSolutionApi();
const { execute: updateSolutionExecute } = updateSolutionApi();
const { execute: deleteSolutionExecute } = deleteSolutionApi();
const { execute: getLanguagesExecute } = GetLanguages();

const languages = ref<Language[]>([]);

onMounted(async () => {
    await getLanguagesExecute().then((res) => {
        if (res.value) {
            languages.value = res.value;
        }
    });
});

interface TemSolution {
    checked: boolean;
    deleted: boolean;
    data: Solution;
}

const emit = defineEmits(['update:solution']);
const solutions = ref<TemSolution[]>([]);

const refreshSolutions = async () => {
    solutions.value = [];
    if (props.problemId !== undefined && props.problemId !== 0) {
        await getProblemExecute({
            id: props.problemId,
        }).then((res) => {
            if (res.value?.solutions) {
                solutions.value = res.value.solutions.map((solution: Solution) => {
                    return {
                        checked: false,
                        deleted: false,
                        data: {
                            ...solution,
                            hash: generateRandomHash(),
                        },
                    };
                });
            }
        });
    }
};

const addSolution = async () => {
    const newSolution: TemSolution = {
        checked: true,
        deleted: false,
        data: {
            id: 0,
            problem_id: props.problemId ?? 0,
            language_id: 1,
            source_code: '',
            hash: generateRandomHash(),
        }
    };
    solutions.value.push(newSolution);
};

const handleCurrentChange = async (val: TemSolution) => {
    if (val) {
        emit('update:solution', val.data);
    }
}

const reset = async (id: number) => {
    const index = solutions.value.findIndex((solution) => solution.data.id === id);
    if (index !== -1) {
        await getSolutionExecute({
            id: id,
        }).then((res) => {
            if (res.value) {
                solutions.value[index].data = {
                    ...res.value,
                    hash: generateRandomHash(),
                };
            }
        });
        solutions.value[index].checked = false;
    }
};

const uploadSolution = async () => {
    if (props.problemId === 0) {
        ElMessage.error('请先上传题目');
        return;
    }
    for (const solution of solutions.value) {
        if (solution.deleted) {
            if (solution.data.id != undefined && solution.data.id !== 0) {
                await deleteSolutionExecute({
                    id: solution.data.id
                });
            }
        } else if (solution.checked) {
            if (solution.data.id !== 0 && solution.data.id !== undefined) {
                await updateSolutionExecute({
                    data: solution.data
                });
            } else {
                await uploadSolutionExecute({
                    data: {
                        ...solution.data,
                        problem_id: props.problemId,
                    }
                });
            }
        }
    };
    await refreshSolutions();
};

watch(() => props.solution, (newSolution) => {
    if (newSolution) {
        const index = solutions.value.findIndex(sol => sol.data.hash === newSolution.hash);
        if (index !== -1) {
            if (JSON.stringify(solutions.value[index].data) !== JSON.stringify(newSolution)) {
                solutions.value[index].data = newSolution;
                solutions.value[index].checked = true;
            }
        } else {
            solutions.value.push({
                checked: true,
                deleted: false,
                data: {
                    ...newSolution,
                    hash: generateRandomHash(),
                }
            });
        }
    }
});

watchEffect(() => {
    solutions.value.forEach(solutions => {
        solutions.data.problem_id = props.problemId ?? 0;
    });
});

const addExistingSolution = (solution: Solution) => {
    solutions.value.push({
        checked: true,
        deleted: false,
        data: {
            hash: generateRandomHash(),
            ...solution,
        },
    });
};

defineExpose({
    refreshSolutions,
    addExistingSolution,
})
</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: space-between;
}

.solution-table {
    display: flex;
    flex-direction: column;
}

.solution-table .el-button {
    width: 120px;
    margin-bottom: 10px;
    align-self: flex-end;
}
</style>