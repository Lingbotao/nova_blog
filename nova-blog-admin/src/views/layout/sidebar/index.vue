<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { adminMenuRoutes } from "@/router/routes";

const route = useRoute();
const router = useRouter();

const handleOpen = () => {};

const handleClose = () => {};

const handleNavigate = (item: { name: string; path: string }) => {
  if (route.path === item.path) return;
  router.push({ name: item.name });
};
</script>

<template>
  <el-menu
    class="h-full"
    :default-active="route.path"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="parent in adminMenuRoutes" :key="parent.name">
      <el-menu-item
        v-if="!parent?.children?.filter((c: any) => !c.hidden).length"
        :index="parent?.children?.[0].path || parent.path"
        @click="handleNavigate(parent)"
      >
        <template #title>
          <el-icon v-if="parent.meta.showIcon">
            <component :is="parent.meta.iconComp"></component>
          </el-icon>
          {{ parent.meta.title }}
        </template>
      </el-menu-item>
      <el-sub-menu v-else :index="parent.path">
        <template #title>
          <el-icon v-if="parent.meta.showIcon">
            <component :is="parent.meta.iconComp"></component>
          </el-icon>
          {{ parent.meta.title }}
        </template>
        <el-menu-item
          v-for="child in parent?.children"
          :key="child.name"
          :index="child.path"
          @click="handleNavigate(child)"
        >
          <template #title>
            <el-icon v-if="child.meta.showIcon">
              <component :is="child.meta.iconComp"></component>
            </el-icon>
            {{ child.meta.title }}
          </template>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<style lang="scss">
.el-menu-item.is-active {
  border-left: 4px solid;
  background-color: var(--el-menu-hover-bg-color)
}
</style>