import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/modules/auth";

class ServerInstance {
  private server: AxiosInstance;
  private whiteList: string[] = [
    '/api/v1/login', 
    '/api/v1/getPubKey',
  ];
  private autoStore:any;

  constructor() {
    this.autoStore = useAuthStore();
    this.server = axios.create({
      // baseURL: '',
      timeout: 1000000,
      withCredentials: true,  // 跨域请求是否需要带上凭证
    });

    this.server.interceptors.request.use(config => {
      // 不对白名单内接口校验jwt
      if(!this.whiteList.includes(config.url || '')) {
        const authStore = useAuthStore()
        config.headers['Authorization'] = `Bearer ${authStore.xAuthToken}`
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    });

    this.server.interceptors.response.use((response) => {
      if(response.status === 200 && response.config.url === '/api/v1/login') {
        const token = response.data.data || null;
        this.autoStore.setXAuthToken(token);
        const redirect = window.$router.currentRoute.value.query.redirect as string || '/home';
        window.$router.replace(redirect) // 登录成功后跳转到之前访问页或者首页
      }
      return response
    }, (error) => {
      // 401 代表未授权，可能是登录状态过期或者没有登录
      if(error.status === 401) {
        window.$message.error(error.data?.message ||'登录状态已过期，请重新登录！')
        this.autoStore.$reset();
        const currentRoute = window.$router.currentRoute.value.path;
        window.$router.replace(`/login?redirect=${encodeURIComponent(currentRoute)}`); // 401时返回登录页需要保存当前访问页路径
      }

      // 客户端或者服务端错误提示
      if([400, 404, 500].includes(error.status)) {
        window.$message.error(error.data?.message || '请求出错啦！')
      }
      return Promise.reject(error)
    });
    
  }

  get: <T, U>(url: string, params?:U) => Promise<T> = async (url, params) => {
    return (await this.server.get(url, { params })).data
  };

  post: <T, U>(url: string, data:U, config?: AxiosRequestConfig) => Promise<T> = async (url, data, config) => {
    return (await this.server.post(url, data, config)).data
  };

  download: <T>(url: string, params?:T) => Promise<Blob> = (url, params) => {
    return this.server.get(url, {
      params,
      responseType: 'blob',
      timeout: 20000,
    })
  }
}

const fetch = new ServerInstance()

export default fetch