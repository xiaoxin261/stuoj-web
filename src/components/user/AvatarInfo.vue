<template>
  <div class="avatar-info">
    <el-popover :width="300" @before-enter="loadInfo"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
      <template #reference>
        <Avatar :src="info?.avatar" :size="size" @click="handelClick" />
      </template>
      <template #default>
        <div>
          <ElContainer direction="vertical">
            <div class="user-popover">
              <UserName :user="info" :size="25" />
              <UserRoleTag style="margin-bottom: 5px;" :role="info.role" />
              <span style="font-size: 16px; margin-bottom: 5px; color:#303133">{{ info.signature }}</span>
              <div class="user-popover-info">
                <div style="display: flex;justify-content: center; gap: 10px;">
                  <span style="display: flex;justify-content: center; gap: 5px;">提交<div style="color: #000;">{{
                    info.submit_count }}</div></span>
                  <span style="display: flex;justify-content: center; gap: 5px;">AC<div style="color: #000;">{{
                    info.ac_count }}</div></span>
                  <span style="display: flex;justify-content: center; gap: 5px;">博客<div style="color: #000;">{{
                    info.blog_count }}</div></span>
                </div>
              </div>
              <span style="font-size: 16px; color: #606266">{{ info.email }}</span>
            </div>
            <ElContainer v-if="id !== 0 && id == userId" style="justify-content: center; margin-top:20px">
              <UserSetting />
              <LogoutButton />
            </ElContainer>
          </ElContainer>
        </div>
      </template>
    </el-popover>
    &nbsp;
    <UserName v-if="name" :user="info" :size="nameSize" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { userStore } from '@/stores/user';
import { getUserInfoApi } from '@/apis/user';
import { type UserInfo } from '@/types/User';
import router from '@/router';

const { id, isLogin, info: info_ } = userStore();

const props = withDefaults(defineProps<{
  userId?: number;
  user?: UserInfo;
  size?: number;
  name?: boolean;
  nameSize?: number;
  popover?: boolean;
}>(), {
  userId: 0,
  user: () => ({} as UserInfo),
  size: 40,
  name: false,
  nameSize: 16,
  popover: true
});

const info = ref<UserInfo>(props.user);
const userId = ref(props.userId);

onBeforeMount(async () => {
  if (!props.userId && !props.user) {
    console.error("头像组件缺少参数");
    return;
  }
  if (!info.value.id) {
    if (!userId.value) {
      userId.value = id.value;
    }
  } else {
    userId.value = info.value.id;
  }
  await updateInfo();
});

const updateInfo = async () => {
  if (userId.value === id.value) {
    info.value = info_.value;
  } else if (!props.user.id) {
    const { state, execute } = getUserInfoApi();
    await execute({
      id: userId.value,
    });
    if (state.value) {
      info.value = state.value;
    }
  }
};

const loadInfo = async () => {
  const { state, execute } = getUserInfoApi();
  await execute({
    id: userId.value,
  });
  if (state.value) {
    info.value = state.value;
  }
};

const handelClick = () => {
  if (!isLogin.value && !info.value.id) {
    router.push('/user/login');
  } else {
    router.push(`/user/${info.value.id}`);
  }
}

</script>

<style scoped>
.avatar-info {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.user-popover {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}

.UserNameText {
  font-size: 25px;
  color: #303133;
}

.user-popover-info {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 5px;
}
</style>