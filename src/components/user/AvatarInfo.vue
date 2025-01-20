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
            <div class="user-popover">
              <span class="UserNameText">{{ info.username }}</span><br/>
              <UserRoleTag :role="info.role"/><br/><br/>
              <span style="font-size: 16px;">{{ info.email }}</span>
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
import { onBeforeMount, onMounted, ref } from 'vue';
import { userStore } from '@/stores/user';
import { getUserInfoApi } from '@/apis/user';
import {Role, type UserInfo} from '@/types/User';
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

let info = ref<UserInfo>(props.user);
let userId = ref(props.userId);

onBeforeMount(async () => {
  if (!info.value.id) {
    if (!userId.value) {
      userId.value = id.value;
    }
    await updateInfo();
  }
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
    }
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
  text-align: center;
}

.UserNameText {
  font-size: 25px;
  color: #303133;
}
</style>