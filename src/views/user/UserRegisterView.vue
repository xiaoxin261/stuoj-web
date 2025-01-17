<template>
  <el-container>
    <el-main>
      <el-row justify="space-around">
        <el-col :span="12">
          <el-card>
            <h1>用户注册</h1>
            <br />
            <el-form ref="ruleFormRef" :model="req" status-icon label-width="80px" :rules="rules">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="req.username" />
              </el-form-item>
              <!--
              <el-form-item label="手机">
                <el-input type="tel" v-model="req.phone" disabled />
              </el-form-item>
-->
              <el-form-item label="邮箱" prop="email">
                <el-input type="email" v-model="req.email" style="flex: 1;" />
              </el-form-item>
              <el-form-item label="验证码" prop="verify_code">
                <el-input type="text" v-model="req.verify_code" placeholder="验证码" style="width: 150px;" />
                <el-button :disabled="isButtonDisabled" type="primary" @click="handleSend" style="margin-left: 10px;">{{
                  buttonText }}</el-button>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="req.password" />
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="req.checkPass" />
              </el-form-item>
              <el-form-item>
                <router-link to="/user/login"><el-button>登录</el-button></router-link>
                &nbsp;&nbsp;
                <el-button type="primary" @click="handleRegister(ruleFormRef)">注册</el-button>
                &nbsp;&nbsp;
                <router-link to="/user/forgot"><el-button>忘记密码？</el-button></router-link>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RegisterApi, SendVerificationCodeApi } from '@/apis/auth';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import router from '@/router';

const { execute: register } = RegisterApi();
const { execute: sendVerificationCode } = SendVerificationCodeApi();

const req = reactive({ username: '', email: '', password: '', verify_code: '', checkPass: '' });

const isButtonDisabled = ref(false);
const buttonText = ref('发送验证码');

const ruleFormRef = ref<FormInstance>()

const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('用户名为空'))
  } if (value.length < 3 || value.length > 15) {
    callback(new Error('用户名长度在 3 到 15 个字符'))
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
  username: [
    { validator: validateUsername, trigger: 'blur' },
  ],
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

const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      register({
        data: {
          username: req.username,
          email: req.email,
          password: req.password,
          verify_code: req.verify_code
        }
      }).then(() => {
        ElNotification({
          title: '成功',
          message: '注册成功',
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

onMounted(() => {
});

</script>