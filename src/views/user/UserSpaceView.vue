<template>
    <div class="space-div">
        <ElContainer class="background">
            <ElRow :gutter="20" style="width: 100%; height: 30%;">
                <ElCol :span="2" class="avatar-container">
                    <Avatar class="avatar" :size="100" :src="info?.avatar" />
                </ElCol>
                <ElCol :span="3">
                    <div class="username">{{ info?.username }}</div>
                    <div class="signature">{{ signature }}}</div>
                </ElCol>
            </ElRow>
        </ElContainer>
        <ElRow>
            <ElCol :span="18">
                <ElCard class="card" shadow="always">
                    <div class="user-info">
                        <div class="info-item">
                            <span class="info-label">邮箱：</span>
                            <span class="info-value">{{ info?.email }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">角色：</span>
                            <span class="info-value">{{ info ? RoleMap[info?.role] : '未知' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">创建时间：</span>
                            <span class="info-value">{{ info?.create_time }}</span>
                        </div>
                    </div>
                </ElCard>
            </ElCol>
        </ElRow>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from "vue";
import { useRouteParams } from "@vueuse/router";
import { userStore } from "@/stores/user";
import { GetUserInfo } from "@/apis/user";
import type { UserInfo } from "@/types/User";

const { info: info_, id } = userStore();
const { execute } = GetUserInfo();

let info = ref<UserInfo>();

const userId = useRouteParams<number>("id");

const signature = ref<string>();
const updateInfo = async () => {
    const userIdNum = Number(userId.value);
    if (userIdNum === id.value) {
        info = info_;
    } else {
        const state = await execute({
            id: userId.value,
        });
        if (state.value) {
            info.value = state.value;
        }
    }
};

watchEffect(() => {
    updateInfo();
});

onBeforeMount(async () => {
    await updateInfo();
});

</script>

<style scoped>
.space-div {
    justify-content: center;
    width: 100%;
    height: 100vh;
    flex-direction: column;
}

.avatar {
    margin-top: 12px;
}

.background {
    display: flex;
    background-color: #EEE;
    margin-top: 5vh;
    height: 250px;
    align-items: flex-end;
    justify-content: flex-end;
}

.username {
    font-size: 40px;
    margin-top: 15px;
    margin-left: 15px;
    text-align: left;
}

.signature {
    font-size: 26px;
    margin-left: 15px;
    text-align: left;
}

.card {
    margin-top: 50px;
}

.user-info {
    display: flex;
    flex-direction: column;
    padding: 5px;
}

.info-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    font-size: 18px;
    margin-right: 10px;
}

.info-value {
    color: #333;
    font-size: 18px;
}
</style>