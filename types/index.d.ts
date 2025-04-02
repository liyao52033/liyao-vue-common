import type { App, DefineComponent } from 'vue';

// 导入时的组件类型定义
declare module 'liyao-vue-common' {
    export const uploadCos: DefineComponent<{}, {}, any>;
    export const uploadLocal: DefineComponent<{}, {}, any>;
    export const GlobalTip: DefineComponent<{}, {}, any>;
    export const BackTop: DefineComponent<{}, {}, any>;
    export const Pagination: DefineComponent<{}, {}, any>;
    export const GithubCorner: DefineComponent<{}, {}, any>;
    export const MonacoEditor: DefineComponent<{}, {}, any>;
    export const WangEditor: DefineComponent<{}, {}, any>;
    export const CopyButton: DefineComponent<{}, {}, any>;
    export const ECharts: DefineComponent<{}, {}, any>;
    export const InputTag: DefineComponent<{}, {}, any>;
    export const TableSelect: DefineComponent<{}, {}, any>;
    export const TextScroll: DefineComponent<{}, {}, any>;
    export const install: (app: App) => void;
    export function useBusuanzi(): {
        site_pv: import('vue').Ref<number>;
        site_uv: import('vue').Ref<number>;
        page_pv: import('vue').Ref<number>;
        page_uv: import('vue').Ref<number>;
    };
    export function useDayDiff(startDate: string, endDate?: string): {
        diffDays: import('vue').ComputedRef<number>;
    };
    export function useTimeDiff(startDate: Date | string, endDate?: Date | string): {
        timeDiff: import('vue').ComputedRef<string>;
    };
    export function useFileDownloader(): {
        base64ToFile: (base64Data: string, filename: string, mimeType: string) => void;
        blobToFile: (blobData: Blob, filename: string, mimeType: string) => void;
    };
    export function useScript(options: {
        src: string;
        async?: boolean;
        defer?: boolean;
        crossOrigin?: 'anonymous' | 'use-credentials';
        integrity?: string;
        type?: string;
        attrs?: Record<string, string>;
    }): {
        isLoaded: import('vue').Ref<boolean>;
        error: import('vue').Ref<Error | null>;
        script: import('vue').Ref<HTMLScriptElement | null>;
    };
    export function useCopyToClipboard(): {
        copyToClipboard: (text: string) => Promise<boolean>;
        copied: import('vue').Ref<boolean>;
        error: import('vue').Ref<Error | null>;
    };
    export function useWatermark(): {
        setWatermark: (text: string, options?: {
            font?: string;
            textColor?: string;
            rotate?: number;
            width?: number;
            height?: number;
        }) => void;
        clearWatermark: () => void;
    };
}

// Vue 全局组件类型定义
declare module 'vue' {
    export interface GlobalComponents {
        uploadCos: DefineComponent<{}, {}, any>;
        uploadLocal: DefineComponent<{}, {}, any>;
        GlobalTip: DefineComponent<{}, {}, any>;
        BackTop: DefineComponent<{}, {}, any>;
        Pagination: DefineComponent<{}, {}, any>;
        GithubCorner: DefineComponent<{}, {}, any>;
        MonacoEditor: DefineComponent<{}, {}, any>;
        WangEditor: DefineComponent<{}, {}, any>;
        CopyButton: DefineComponent<{}, {}, any>;
        ECharts: DefineComponent<{}, {}, any>;
        InputTag: DefineComponent<{}, {}, any>;
        TableSelect: DefineComponent<{}, {}, any>;
        TextScroll: DefineComponent<{}, {}, any>;
    }
}

declare module '@/components/Upload/uploadCos.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/BackTop/BackTop.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/GlobalTip' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/Upload/uploadLocal.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/Pagination/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/GithubCorner/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/MonacoEditor/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/WangEditor/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/CopyButton/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/ECharts/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/InputTag/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/TableSelect/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/TextScroll/index.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 默认导出
declare const _default: {
    install: (app: App) => void;
    uploadCos: DefineComponent<{}, {}, any>;
    uploadLocal: DefineComponent<{}, {}, any>;
    GlobalTip: DefineComponent<{}, {}, any>;
    BackTop: DefineComponent<{}, {}, any>;
    Pagination: DefineComponent<{}, {}, any>;
    GithubCorner: DefineComponent<{}, {}, any>;
    MonacoEditor: DefineComponent<{}, {}, any>;
    WangEditor: DefineComponent<{}, {}, any>;
    CopyButton: DefineComponent<{}, {}, any>;
    ECharts: DefineComponent<{}, {}, any>;
    InputTag: DefineComponent<{}, {}, any>;
    TableSelect: DefineComponent<{}, {}, any>;
    TextScroll: DefineComponent<{}, {}, any>;
    useBusuanzi: () => {
        site_pv: import('vue').Ref<number>;
        site_uv: import('vue').Ref<number>;
        page_pv: import('vue').Ref<number>;
        page_uv: import('vue').Ref<number>;
    };
    useDayDiff: (startDate: string, endDate?: string) => {
        diffDays: import('vue').ComputedRef<number>;
    };
    useFileDownloader: () => {
        base64ToFile: (base64Data: string, filename: string, mimeType: string) => void;
        blobToFile: (blobData: Blob, filename: string, mimeType: string) => void;
    };
    useTimeDiff: (startDate: Date | string, endDate?: Date | string) => {
        timeDiff: import('vue').ComputedRef<string>;
    };
    useScript: (options: {
        src: string;
        async?: boolean;
        defer?: boolean;
        crossOrigin?: 'anonymous' | 'use-credentials';
        integrity?: string;
        type?: string;
        attrs?: Record<string, string>;
    }) => {
        isLoaded: import('vue').Ref<boolean>;
        error: import('vue').Ref<Error | null>;
        script: import('vue').Ref<HTMLScriptElement | null>;
    };
    useCopyToClipboard: () => {
        copyToClipboard: (text: string) => Promise<boolean>;
        copied: import('vue').Ref<boolean>;
        error: import('vue').Ref<Error | null>;
    };
    useWatermark: () => {
        setWatermark: (text: string, options?: {
            font?: string;
            textColor?: string;
            rotate?: number;
            width?: number;
            height?: number;
        }) => void;
        clearWatermark: () => void;
    };
};

export default _default;