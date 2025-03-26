<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            :background-color="sidebar.bgColor"
            :text-color="sidebar.textColor"
            router
        >
            <template v-for="item in menuData">
                <template v-if="item.children">
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.id">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-sub-menu
                                v-if="subItem.children"
                                :index="subItem.index"
                                :key="subItem.index"
                                v-permiss="item.id"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem, i) in subItem.children"
                                    :key="i"
                                    :index="threeItem.index"
                                >
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.id">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.id">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';
import { menuData } from '@/components/menu';

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 55px;
    bottom: 5px;
    overflow-y: auto;
    margin: 0 5px;
    padding: 0px;
    background-color: #595959; /* 更改为白色背景 */
    border-radius: 10px;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 180px; /* 调整宽度 */
    font-size: 14px; /* 增加字体大小 */
}

.sidebar-el-menu.el-menu--collapse {
    width: 60px;
}

.sidebar-el-menu {
    min-height: 100%;
    border-radius: 10px;
}

.sidebar-el-menu .el-menu-item,
.sidebar-el-menu .el-sub-menu__title {
    margin: 5px 0; /* 增加菜单项之间的间距 */
    padding: 10px 15px; /* 增加内边距 */
    border-radius: 5px; /* 菜单项圆角 */
    transition: background-color 0.3s; /* 添加过渡效果 */
}
</style>
