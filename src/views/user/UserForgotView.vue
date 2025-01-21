<script setup lang="ts">
import { ref, reactive } from "vue";
import { SendVerificationCodeApi } from '@/apis/auth';
import { ModifyPassword } from "@/apis/user";
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/router';

const { execute: sendVerificationCode } = SendVerificationCodeApi();
const { execute: resetPassword } = ModifyPassword();

const req = reactive({ email: '', password: '', verify_code: '', checkPass: '' });

const isButtonDisabled = ref(false);
const buttonText = ref('发送验证码');

const ruleFormRef = ref<FormInstance>()

const validateEmail = (rule: any, value: any, callback: any) => {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (value === '') {
    callback(new Error('邮箱为空'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码为空'))
  } else {
    if (req.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
};

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重复输入密码'))
  } else if (value !== req.password) {
    callback(new Error("两次输入密码不一致"))
  } else {
    callback()
  }
}

const validateVerifyCode = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('验证码为空'))
  } else if (value.length !== 6) {
    callback(new Error('验证码长度为6位'))
  } else {
    callback()
  }
};

const rules = reactive<FormRules<typeof req>>({
  email: [
    { validator: validateEmail, trigger: 'blur' },
  ],
  password: [
    { validator: validatePass, trigger: 'blur' },
  ],
  checkPass: [
    { validator: validatePass2, trigger: 'blur' },
  ],
  verify_code: [
    { validator: validateVerifyCode, trigger: 'blur' },
  ],
})

const handleSend = async () => {
  isButtonDisabled.value = true;
  buttonText.value = '60秒后重试';
  let countdown = 60;
  const interval = setInterval(() => {
    countdown--;
    buttonText.value = `${countdown}秒后重试`;
    if (countdown === 0) {
      clearInterval(interval);
      isButtonDisabled.value = false;
      buttonText.value = '发送验证码';
    }
  }, 1000);

  await sendVerificationCode({
    data: {
      email: req.email,
    }
  }).then(() => {

  });
};

const handleResetPassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      resetPassword({
        data: {
          email: req.email,
          password: req.password,
          verify_code: req.verify_code
        }
      }).then(() => {
        ElNotification({
          title: '成功',
          message: '密码修改成功',
          type: 'success',
        });
        router.push('/user/login')
      });
    } else {
      ElNotification({
        title: '错误',
        message: '请检查输入',
        type: 'error',
      });
    }
  })
};
</script>

<template>
  <div class="container-full">
  <el-container>
    <el-main>
      <el-row justify="space-around">
        <el-col :span="12">
          <el-card>
            <h1>找回密码</h1>
            <br />
            <el-form ref="ruleFormRef" :model="req" status-icon label-width="80px" :rules="rules">
              <el-form-item label="电子邮箱" prop="email">
                <el-input type="email" v-model="req.email" />
              </el-form-item>
              <el-form-item label="验证码" prop="verify_code">
                <el-input type="text" v-model="req.verify_code" placeholder="验证码" style="width: 150px;" />
                <el-button :disabled="isButtonDisabled" type="primary" @click="handleSend" style="margin-left: 10px;">{{
                  buttonText }}</el-button>
              </el-form-item>
              <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="req.password" />
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="req.checkPass" />
              </el-form-item>
              <el-form-item>
                <router-link to="/user/login"><el-button>登录</el-button></router-link>
                &nbsp;&nbsp;
                <router-link to="/user/register"><el-button>注册</el-button></router-link>
                &nbsp;&nbsp;
                <el-button type="primary" @click="handleResetPassword(ruleFormRef)">修改密码</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  </div>
</template>

<style scoped></style>