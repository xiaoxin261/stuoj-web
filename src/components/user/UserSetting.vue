<template>
    <ElButton class="ToUserSettingButton" size="small" @click="dialogVisible = !dialogVisible">
        <el-icon>
            <SetUp />
        </el-icon>&nbsp;
        设置
    </ElButton>
    <ElDialog v-model="dialogVisible" title="修改信息" width="500" append-to-body>
        <div class="avatar-container">
            <AvatarCropper v-model:user="info" />
        </div>
        <ElForm :model="info_" label-width="80px" style="margin-top: 15px;">
            <ElFormItem label="用户名">
                <ElInput v-model="info_.username" />
            </ElFormItem>
            <ElFormItem label="签名">
                <ElInput v-model="info_.signature" />
            </ElFormItem>
            <ElFormItem label="邮箱">
                <ElInput v-model="info_.email" disabled />
            </ElFormItem>
            <ElFormItem v-if="localInfo.role >= Role.Admin" label="角色">
                <UserRoleSelect v-model="userRole" />
            </ElFormItem>
        </ElForm>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">修改</el-button>
            </div>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults, watch } from "vue";
import { SetUp } from "@element-plus/icons-vue"
import { userStore } from "@/stores/user";
import { getUserInfoApi, ModifyUserInfo, modifyUserRoleApi } from "@/apis/user";
import { Role, type UserInfo } from "@/types/User";
import { ElMessage } from "element-plus";

const { id, info: localInfo } = userStore();

const { execute: getUserExcute } = getUserInfoApi();
const { execute: modifyUserInfoExcute } = ModifyUserInfo();
const { execute: modifyUserRoleExcute } = modifyUserRoleApi();

const info = ref<UserInfo>({
    avatar: "",
    id: 0,
    role: Role.Visitor,
    username: ""
});

const props = withDefaults(defineProps<{
    userId?: number;
}>(), {
    userId: 0,
});

const dialogVisible = ref(false);

const userId = ref(props.userId);

const info_ = ref<UserInfo>({
    avatar: "",
    id: 0,
    role: Role.Visitor,
    username: ""
});

const userRole = ref(Role.Visitor);

const handleCancel = () => {
    dialogVisible.value = false;
    info_.value = info.value;
};

const handleConfirm = () => {
    if (info.value.id === 0)
        return;
    if (userRole.value !== info.value.role) {
        modifyUserRoleExcute({
            data: {
                id: info_.value.id,
                role: userRole.value
            }
        });
    };
    modifyUserInfoExcute({
        data: {
            id: info_.value.id,
            username: info_.value.username,
            signature: info_.value.signature || info.value.signature || "",
        }
    }).then((res) => {
        refresh();
    });
    ElMessage.success("已请求修改");
};

const refresh = async () => {
    await getUserExcute({
        id: userId.value
    }).then((res) => {
        if (!res.value) {
            return;
        };
        info.value = res.value;
        info_.value = res.value;
        userRole.value = res.value.role;
    });
};


watch(() => dialogVisible.value, async () => {
    if (info.value.id !== 0) {
        return;
    }
    if (props.userId) {
        userId.value = props.userId;
    } else {
        userId.value = id.value;
    }
    refresh();
});

</script>

<style>
.avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>