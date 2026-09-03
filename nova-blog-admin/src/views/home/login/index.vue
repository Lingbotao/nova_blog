<script lang="ts" setup>
import { reactive, ref, toRaw } from "vue";
import { login } from '@/api';
import { encrypt } from '@/utils/encrypt'

const userInfo = reactive<{
  username: string,
  password: string,
}>({
  username: "",
  password: "",
});

const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  const encryptInfo = await encrypt(toRaw(userInfo))
  if(encryptInfo) {
    try {
      await login(encryptInfo);
    } catch(e) {
      loading.value = false;
    }
  }
  loading.value = false;
}
</script>

<template>
  <div class="login-container h-full w-full relative">
    <div
      class="absolute flex items-center flex-col -translate-y-1/2 bg-white/80 top-1/2 right-32 rounded-2xl px-4 py-6">
      <h2 class="text-4xl text-sky-600 font-bold mb-4">Nova Blog 管理后台</h2>
      <p class="text-lg text-sky-400 mb-2">请登录</p>
      <el-form class="w-80" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userInfo.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="loading" type="primary" class="w-full" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  background-image: url("@/assets/png/home-background.png");
  background-size: cover;
  background-position: center;
}
</style>
