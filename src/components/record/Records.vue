<template>
    <ElCard>
        <RecordSelect v-model:parmas="paramsSelect" @confirm-clicked="handleQuery" />
    </ElCard>
    <br />
    <ElCard>
        <RecordList :admin="admin" v-model:submissions="submissions" @delete="handleQuery" />
        <br />
        <ElPagination class="pagination" v-model:current-page="paramsPage.page" v-model:page-size="paramsPage.size"
            :page-sizes="[10, 20, 50, 100]" :size="'small'" :background="true"
            layout="total, sizes, prev, pager, next, jumper" :total="recordPage?.total" @size-change="handleQuery"
            @current-change="handleQuery" />
    </ElCard>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { getRecordListApi } from '@/apis/record';
import { type RecordParams, type Submission } from '@/types/Record';
import { type Page } from '@/types/misc';
import { useRoute } from 'vue-router';

const { execute } = getRecordListApi();

const props = withDefaults(defineProps<{
    admin?: boolean;
}>(), {
    admin: false
});

const paramsSelect = ref<RecordParams>({
    page: 1,
    size: 20,
});

const paramsPage = ref<RecordParams>({
    page: 1,
    size: 20,
});


const params = ref<RecordParams>({
    page: 1,
    size: 20,
});

const route = useRoute();
onBeforeMount(() => {
    const user = route.query.user;
    const problem = route.query.problem;
    if (typeof user === 'string') {
        paramsSelect.value.user = user
    };
    if (typeof problem === 'string') {
        paramsSelect.value.problem = problem
    };
});

const submissions = ref<Submission[]>([]);

const recordPage = ref<Page<"submissions", Submission>>();

const handleQuery = async () => {
    params.value = {
        ...paramsSelect.value,
        page: paramsPage.value.page,
        size: paramsPage.value.size,
    }
    await execute({
        params: params.value
    }).then((res) => {
        submissions.value = res.value?.submissions || [];
        recordPage.value = res.value;
    });
}

onMounted(() => {
    handleQuery();
});

</script>