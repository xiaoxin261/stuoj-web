<template>
    <ElCard v-if="select">
        <CommentSelect v-model:params="paramsSelect" @confirm-clicked="handleQuery" />
    </ElCard>
    <br v-if="select" />
    <CommentList :comments="commentPage?.comments" @delete="handleQuery" />
    <br />
    <ElPagination class="pagination" v-model:current-page="paramsPage.page" v-model:page-size="paramsPage.size"
        :page-sizes="[10, 20, 50, 100]" :size="'small'" :background="true"
        layout="total, sizes, prev, pager, next, jumper" :total="commentPage?.total" @size-change="handleQuery"
        @current-change="handleQuery" />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { getCommentListApi } from '@/apis/comment';
import type { commentParams, commentInfo } from '@/types/Comment';
import { type Page } from '@/types/misc';
import { useRoute } from 'vue-router';

const { execute } = getCommentListApi();

const props = withDefaults(defineProps<{
    admin?: boolean;
    select?: boolean;
    userId?: number;
    blogId?: number,
}>(), {
    admin: false,
    select: true,
});

const paramsSelect = ref<commentParams>({
    page: 1,
    size: 20,
    user: props.userId,
    blog: props.blogId,
});

const paramsPage = ref<commentParams>({
    page: 1,
    size: 20,
});


const params = ref<commentParams>({
    page: 1,
    size: 20,
});

const route = useRoute();
onBeforeMount(() => {
    const user = route.query.user;
    const blog = route.query.blog;
    if (typeof user === 'string') {
        paramsSelect.value.user = parseInt(user, 10);
    };
    if (typeof blog === 'string') {
        paramsSelect.value.blog = parseInt(blog, 10);
    };
});

const commentPage = ref<Page<'comments', commentInfo>>();

const handleQuery = async () => {
    params.value = {
        ...paramsSelect.value,
        page: paramsPage.value.page,
        size: paramsPage.value.size,
    }
    await execute({
        params: params.value
    }).then((res) => {
        commentPage.value = res.value;
    });
}

onMounted(() => {
    handleQuery();
});

defineExpose({
    handleQuery
});

</script>