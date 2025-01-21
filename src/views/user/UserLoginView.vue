<template>
   <div class="container-full">
     <el-container>
       <el-main>
         <el-row justify="space-around">
           <el-col :span="12">
             <el-card>
               <h1>用户登录</h1>
               <br/>
               <el-form :model="req" label-width="80px">
                 <el-form-item label="邮箱">
                   <el-input v-model="req.email" />
                 </el-form-item>
                 <el-form-item label="密码">
                   <el-input type="password" v-model="req.password" />
                 </el-form-item>
                 <el-form-item>
                   <el-checkbox-group>
                     <el-checkbox label="记住密码" disabled/>
                   </el-checkbox-group>
                 </el-form-item>
                 <el-form-item>
                   <el-button type="primary" @click="handleLogin">登录</el-button>
                   &nbsp;&nbsp;
                   <router-link to="/user/register"><el-button>注册</el-button></router-link>
                   &nbsp;&nbsp;
                   <router-link to="/user/forgot"><el-button>忘记密码？</el-button></router-link>
                 </el-form-item>
               </el-form>
             </el-card>
           </el-col>
         </el-row>
       </el-main>
     </el-container>
   </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { LoginApi } from '@/apis/auth';
import type { LoginReq } from '@/types/User';
import { userStore } from '@/stores/user'
import { ElNotification, type FormItemProps } from 'element-plus';
import router from '@/router';

const req = ref<LoginReq>({ email: '', password: '' });
const itemLabelPosition = ref<FormItemProps['labelPosition']>('right')
const { updateToken, getUserInfo } = userStore();

const handleLogin = async () => {
    const { execute } = LoginApi();
    const state = await execute({
        data: {
            email: req.value.email,
            password: req.value.password
        }
    })
    if (state.value) {
        updateToken(state.value);
        ElNotification({
            title: "登录成功",
            type: "success"
        });
        router.push({ name: 'home' }).then(() => {
            window.location.reload();
        });
    }
};

onMounted(() => {
});

</script>