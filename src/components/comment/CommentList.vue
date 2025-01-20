<template>
  <div v-for="comment in comments" :key="comment.id">
    <ElCard class="comment-card">
      <div style="display: flex; justify-content: space-between;">
        <AvatarInfo :user="comment.user" name :name-size="16" />
        <div>
          <span v-if="info.role >= Role.Admin || comment.user.id === id">
            <ElPopconfirm title="确认要删除吗" @confirm="handleConfirmDelete(comment.id)">
              <template #reference>
                <ElButton size="small" type="danger">删除</ElButton>
              </template>
            </ElPopconfirm>
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-icon><DocumentAdd /></el-icon>
          &nbsp;{{ formatDateTimeStr(comment.create_time) }}
        </div>
      </div>
      <br />
      {{ comment.content }}
    </ElCard>
  </div>

</template>

<script setup lang="ts">
import type { CommentInfo } from '@/types/Comment';
import { ref, type PropType } from 'vue';
import { formatDateTimeStr } from '@/utils/date';
import { deleteCommentApi } from '@/apis/comment';
import { ElNotification, ElPopconfirm } from 'element-plus';
import { userStore } from '@/stores/user';
import { Role } from '@/types/User';

const { info, id } = userStore();
const { execute } = deleteCommentApi();

const props = defineProps({
  comments: {
    type: Array as PropType<CommentInfo[]>,
    default: () => []
  }
});

const emit = defineEmits(['delete']);

const handleConfirmDelete = (id: number) => {
  execute({
    id
  }).then(() => {
    ElNotification({ type: 'success', message: '删除成功' });
    emit('delete');
  });
};
</script>

<style lang="scss">
.comment-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px
}
</style>