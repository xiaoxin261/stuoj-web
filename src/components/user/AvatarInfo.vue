<template>
  <div class="avatar-info">
    <el-popover :width="300"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
      <template #reference>
        <Avatar :src="info?.avatar" :size="size" @click="handelClick" />
      </template>
      <template #default>
        <div>
          <ElContainer direction="vertical">
            <div class="UserNameText">{{ info.username }}</div>
            <ElContainer v-if="id == userId" style="justify-content: center;">
              <LogoutButton v-if="id !== 0 && id == userId" />
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
import { onBeforeMount, onMounted, ref } from 'vue';
import { userStore } from '@/stores/user';
import { getUserInfoApi } from '@/apis/user';
import { Role, type UserInfo } from '@/types/User';
import router from '@/router';
import { roleTypes } from "element-plus";

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

let info = ref<UserInfo>(props.user);
let userId = ref(props.userId);

onBeforeMount(async () => {
  if (!info.value.id) {
    if (!userId.value)
      userId.value = id.value;
    updateInfo();
  };
});

const updateInfo = async () => {
  if (userId.value === id.value) {
    info = info_;
  } else {
    const { state, execute } = getUserInfoApi();
    await execute({
      id: userId.value,
    });
    if (state.value) {
      info.value = state.value;
    };
  };
};

const handelClick = () => {
  if (!isLogin.value) {
    router.push('/user/login');
  } else {
    router.push(`/user/${userId.value}`);
  }
}

</script>

<style scoped>
.avatar-info {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.UserNameText {
  display: flex;
  justify-content: center;
  font-size: 25px;
  color: #303133;
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>