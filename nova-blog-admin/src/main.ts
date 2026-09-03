import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";

// import styles
import "./style.css";
import "element-plus/dist/index.css";

const app = createApp(App);

app.use(ElementPlus);
setupStore(app);
setupRouter(app);


window.$message = app.config.globalProperties.$message;

// mount the app
app.mount("#app");
