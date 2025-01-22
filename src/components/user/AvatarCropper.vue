<template>
    <Avatar :src="user?.avatar" :size="80" @click="handelClickAvatar" />
    <input type="file" ref="fileInput" accept="image/*" style="display: none;" @change="onFileChange" />
    <ElDialog v-model="dialogVisible" title="图片裁切" style="width: 600px;">
        <div class="cropper-box" :style="cropperStyle">
            <VueCropper ref="cropper" :img="img" :output-size="1" :output-type="'png'" :info="true" :auto-crop="true"
                :autoCropWidth="300" :autoCropHeight="300" :fixed="true" :canMove="true" :canMoveBox="true"
                :outerSize="10" />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="upload" :loading="loading">确认</el-button>
        </div>
    </ElDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import 'vue-cropper/dist/index.css';
import { VueCropper } from "vue-cropper";
import { uploadAvatarApi } from '@/apis/user';
import type { UserInfo } from '@/types/User';

const { execute } = uploadAvatarApi();

const props = defineProps<{
    user?: UserInfo;
}>();

const user = ref<UserInfo>();

const dialogVisible = ref(false);

const imgName = ref('');
const img = ref('');

const cropper: any = ref({})

const cropperStyle = computed(() => ({
    width: '400px',
    height: '400px',
}));

const close = () => {
    dialogVisible.value = false;
};

const loading = ref(false);

const upload = async () => {
    if (!cropper.value) {
        ElMessage.error('裁剪器未初始化');
        return;
    }
    if (!user.value) {
        ElMessage.error('用户信息未初始化');
        return;
    }

    loading.value = true;
    try {
        await cropper.value.getCropBlob(
            async (cropData: any) => {
                if (!(cropData instanceof Blob)) {
                    ElMessage.error('裁剪结果不是有效的 Blob 对象', cropData);
                    return;
                };
                const formData = new FormData();
                formData.append('file', cropData, imgName.value);
                await execute({
                    id: user.value?.id || 0,
                    data: formData
                }).then((res) => {
                    if (res.value && user.value) {
                        user.value.avatar = res.value;
                    } else {
                        ElMessage.error('头像上传失败');
                    }
                });
            })
    } catch (error) {
        ElMessage.error('图片裁剪失败');
    } finally {
        loading.value = false;
        close();
    }
    ElMessage.success("已请求修改");
};

const fileInput = ref<HTMLInputElement | null>(null);
const handelClickAvatar = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const onFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        img.value = imageUrl;
        imgName.value = file.name;
        dialogVisible.value = true;
    }
};

watch(() => props.user, () => {
    user.value = props.user;
}, { immediate: true, deep: true });
</script>

<style scoped>
.cropper-box {
    margin: 0 auto;
    margin-bottom: 10px;
}

.dialog-footer {
    text-align: right;
}
</style>