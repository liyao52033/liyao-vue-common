import type { App, Component } from 'vue'

// 导入所有组件
import uploadCos from '../Upload/uploadCos.vue';
import uploadLocal from '../Upload/uploadLocal.vue';

// 组件注册表 - 只需要在这里添加新组件
const componentList = {
    uploadCos,
    uploadLocal
};

// 类型定义，用于自动导出
export type ComponentList = typeof componentList;

// 自动注册组件
function install(app: App) {
    Object.entries(componentList).forEach(([name, component]) => {
        app.component(name, component as Component);
    });
}

// 导出所有组件和安装函数
export { install };
export { uploadCos, uploadLocal };

// 默认导出
const exportDefault = {
    install,
    ...componentList
};

export default exportDefault;