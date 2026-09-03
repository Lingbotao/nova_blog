<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="text-2xl text-gray-500">欢迎来到 Nova Blog 后台管理系统</div>
    <el-upload
      class="upload-demo"
      action="/api/v1/blog/uploadImage"
      :show-file-list="false"
      :headers="{
        'Authorization': `Bearer ${token}`
      }"
      :before-upload="handleBeforeUpload"
    >
      <el-button type="primary">点击上传图片测试接口</el-button>
    </el-upload>
    <img src="http://localhost:3000/v1/common/download?id=C88DFCC146C74E479F5657BD13A05660">
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/modules/auth";

const authStore = useAuthStore();

const token = authStore.xAuthToken;
const handleBeforeUpload = () => {
  // 可以在这里对文件进行预处理，例如添加额外的参数或验证文件类型
  return true; // 返回 false 可以阻止上传
}
</script>