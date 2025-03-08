import type { App, DefineComponent } from 'vue';

// 导入时的组件类型定义
declare module 'liyao-vue-common' {
    export const uploadCos: DefineComponent<{}, {}, any>;
    export const uploadLocal: DefineComponent<{}, {}, any>;
    export const install: (app: App) => void;
}

// Vue 全局组件类型定义
declare module 'vue' {
    export interface GlobalComponents {
        uploadCos: DefineComponent<{}, {}, any>;
        uploadLocal: DefineComponent<{}, {}, any>;
    }
}

declare module '@/components/Upload/uploadCos.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/Upload/uploadLocal.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 默认导出
declare const _default: {
    install: (app: App) => void;
    uploadCos: DefineComponent<{}, {}, any>;
    uploadLocal: DefineComponent<{}, {}, any>;
};

export default _default;