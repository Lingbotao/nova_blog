import { defineStore } from "pinia";
import { ref } from "vue";
import Cookie from "js-cookie";

export const useAuthStore = defineStore('auth', () => {
  const xAuthToken = ref<string | null>(Cookie.get('x-auth-token') || null); // 从cookie中获取token，保持刷新后登录状态

  /**
   * 设置jwt 全局变量
   * @param token 
   */
  const setXAuthToken = (token?: string):void => {
    xAuthToken.value = token || null;
  }

  const $reset = () => {
    xAuthToken.value = null;
  }

  return {
    xAuthToken,
    setXAuthToken,
    $reset
  }
})