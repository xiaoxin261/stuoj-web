import { deleteSolutionApi, deleteTestcaseApi, getProblemApi, getSolutionApi, getTestcaseApi, updateSolutionApi, updateTestcaseApi, uploadSolutionApi, uploadTestcaseApi } from "@/apis/problem";
import type { Solution, Testcase } from "@/types/Problem";
import { generateRandomHash } from "@/utils/hash";
import { createGlobalState } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ref, toRaw, watch } from "vue";
import _ from 'lodash';

export interface TemData<T> {
    checked: boolean;
    deleted: boolean;
    data: T;
};

export const problemEditStore = createGlobalState(() => {
    const { execute: getProblemExecute } = getProblemApi();
    const { execute: getTestcaseExecute } = getTestcaseApi();
    const { execute: uploadTestcaseExecute } = uploadTestcaseApi();
    const { execute: updateTestcaseExecute } = updateTestcaseApi();
    const { execute: deleteTestcaseExecute } = deleteTestcaseApi();

    const problemId = ref(0);

    const testcases = ref<TemData<Testcase>[]>([]);

    const currentTestcase = ref<Testcase>({
        id: 0,
        problem_id: 0,
        serial: 0,
        test_input: '',
        test_output: '',
    });

    const resetTestcase = async (id: number) => {
        const index = testcases.value.findIndex((testcase) => testcase.data.id === id);
        if (index !== -1) {
            await getTestcaseExecute({
                id: id,
            }).then((res) => {
                if (res.value) {
                    testcases.value[index].data = {
                        ...res.value,
                        hash: testcases.value[index].data.hash,
                    };
                }
            });
            testcases.value[index].checked = false;
            if (currentTestcase.value.hash === testcases.value[index].data.hash) {
                currentTestcase.value = testcases.value[index].data;
            }
        }
    };

    const resetCurrentTestcase = async () => {
        if (!currentTestcase.value || !currentTestcase.value.id) return;

        const index = testcases.value.findIndex((testcase) =>
            testcase.data.id === currentTestcase.value.id
        );

        if (index !== -1) {
            await getTestcaseExecute({
                id: currentTestcase.value.id,
            }).then((res) => {
                if (res.value) {
                    testcases.value[index].data = {
                        ...res.value,
                        hash: testcases.value[index].data.hash,
                    };
                    currentTestcase.value = {
                        ...res.value,
                        hash: currentTestcase.value.hash,
                    };
                }
            });
            testcases.value[index].checked = false;
        }
    };

    const refreshTestcases = async () => {
        testcases.value = [];
        if (problemId.value === 0) {
            ElMessage.error('请先上传题目');
            return;
        }
        await getProblemExecute({
            id: problemId.value,
            params: {
                testcases: true,
            }
        }).then((res) => {
            if (res.value?.testcases) {
                testcases.value = res.value.testcases.map((testcase: Testcase) => {
                    return {
                        checked: false,
                        deleted: false,
                        data: {
                            ...testcase,
                            hash: generateRandomHash(),
                        },
                    };
                });
            }
        });
    };

    const uploadTestcase = async () => {
        if (problemId.value === 0) {
            ElMessage.error('请先上传题目');
            return;
        }
        for (const testcase of testcases.value) {
            if (testcase.deleted) {
                if (testcase.data.id != undefined && testcase.data.id !== 0) {
                    await deleteTestcaseExecute({
                        id: testcase.data.id
                    });
                }
            } else if (testcase.checked) {
                if (testcase.data.id !== 0 && testcase.data.id !== undefined) {
                    await updateTestcaseExecute({
                        data: testcase.data
                    });
                } else {
                    await uploadTestcaseExecute({
                        data: {
                            ...testcase.data,
                            problem_id: problemId.value ?? 0
                        }
                    });
                }
            }
        };
        await refreshTestcases();
    };

    watch(() => currentTestcase, (newTestcase) => {
        if (newTestcase) {
            const index = testcases.value.findIndex(tc => tc.data.hash === newTestcase.value.hash);
            if (index !== -1) {
                // 使用 Lodash 的 isEqual 进行深比较
                if (!_.isEqual(toRaw(testcases.value[index].data), toRaw(newTestcase.value))) {
                    testcases.value[index].data = newTestcase.value;
                    testcases.value[index].checked = true;
                }
            } else {
                testcases.value.push({
                    checked: true,
                    deleted: false,
                    data: newTestcase.value
                });
            }
        }
    }, { deep: true });



    const { execute: getSolutionExecute } = getSolutionApi();
    const { execute: uploadSolutionExecute } = uploadSolutionApi();
    const { execute: updateSolutionExecute } = updateSolutionApi();
    const { execute: deleteSolutionExecute } = deleteSolutionApi();

    const solutions = ref<TemData<Solution>[]>([]);
    const currentSolution = ref<Solution>({
        id: 0,
        language_id: 0,
        problem_id: 0,
        source_code: '',
    });

    const refreshSolutions = async () => {
        solutions.value = [];
        if (problemId.value === 0) {
            ElMessage.error('请先上传题目');
            return;
        }
        await getProblemExecute({
            id: problemId.value,
            params: {
                solutions: true,
            }
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
    };

    const resetSolution = async (id: number) => {
        const index = solutions.value.findIndex((solution) => solution.data.id === id);
        if (solutions.value[index].data.id === undefined || solutions.value[index].data.id === 0) {
            await getSolutionExecute({
                id: id
            }).then((res) => {
                if (res.value) {
                    solutions.value[index].data = {
                        ...res.value,
                        hash: solutions.value[index].data.hash,
                    }
                }
            });
            solutions.value[index].checked = false;
            if (currentSolution.value.hash === solutions.value[index].data.hash) {
                currentSolution.value = solutions.value[index].data;
            }
        }
    };

    const resetCurrentSolution = async () => {
        if (!currentSolution.value || !currentSolution.value.id) return;

        const index = solutions.value.findIndex((solution) =>
            solution.data.id === currentSolution.value.id
        );

        if (index !== -1) {
            await getSolutionExecute({
                id: currentSolution.value.id
            }).then((res) => {
                if (res.value) {
                    solutions.value[index].data = {
                        ...res.value,
                        hash: solutions.value[index].data.hash,
                    };
                    currentSolution.value = {
                        ...res.value,
                        hash: currentSolution.value.hash,
                    };
                }
            });
            solutions.value[index].checked = false;
        }
    };

    const uploadSolution = async () => {
        if (problemId.value === 0) {
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
                            problem_id: problemId.value ?? 0
                        }
                    });
                }
            }
        };
        await refreshSolutions();
    };

    watch(() => currentSolution, (newSolution) => {
        if (newSolution) {
            const index = solutions.value.findIndex(st => st.data.hash === newSolution.value.hash);
            if (index !== -1) {
                // 使用 Lodash 的 isEqual 进行深比较
                if (!_.isEqual(toRaw(solutions.value[index].data), toRaw(newSolution.value))) {
                    solutions.value[index].data = newSolution.value;
                    solutions.value[index].checked = true;
                }
            } else {
                solutions.value.push({
                    checked: true,
                    deleted: false,
                    data: newSolution.value
                });
            }
        }
    }, { deep: true });


    watch(() => problemId.value, () => {
        testcases.value.forEach(testcase => {
            testcase.data.problem_id = problemId.value ?? 0;
            testcase.data.id = 0;
            testcase.checked = true;
        });
        solutions.value.forEach(testcase => {
            testcase.data.problem_id = problemId.value ?? 0;
            testcase.data.id = 0;
            testcase.checked = true;
        });
    }, { immediate: true });

    return {
        problemId,
        testcases,
        currentTestcase,
        refreshTestcases,
        resetTestcase,
        resetCurrentTestcase,
        uploadTestcase,
        solutions,
        currentSolution,
        resetSolution,
        resetCurrentSolution,
        uploadSolution,
        refreshSolutions,
    };
})