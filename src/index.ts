import type { App, Component } from 'vue'

// 导入所有组件
import uploadCos from './components/Upload/uploadCos.vue';
import uploadLocal from './components/Upload/uploadLocal.vue';
import GlobalTip from './components/GlobalTip';
import BackTop from './components/BackTop/BackTop.vue';
import Pagination from './components/Pagination/index.vue';
import GithubCorner from './components/GithubCorner/index.vue';
import MonacoEditor from './components/MonacoEditor/index.vue';
import WangEditor from './components/WangEditor/index';
import CopyButton from './components/CopyButton/index.vue';
import ECharts from './components/ECharts/index.vue';
import InputTag from './components/InputTag/index.vue';
import TableSelect from './components/TableSelect/index.vue';
import TextScroll from './components/TextScroll/index.vue';

// 导入所有hooks
import { useBusuanzi } from './hooks/useBusuanzi';
import { useDayDiff, useTimeDiff } from './hooks/date';
import { useFileDownloader } from './hooks/useFileDownloader';
import { useScript } from './hooks/useScript';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { useWatermark } from './hooks/useWatermark';

// 组件注册表 - 只需要在这里添加新组件
const componentList = {
    uploadCos,
    uploadLocal,
    GlobalTip,
    BackTop,
    Pagination,
    GithubCorner,
    MonacoEditor,
    WangEditor,
    CopyButton,
    ECharts,
    InputTag,
    TableSelect,
    TextScroll
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
export { uploadCos, uploadLocal, GlobalTip, BackTop, Pagination, GithubCorner, MonacoEditor, WangEditor, CopyButton, ECharts, InputTag, TableSelect, TextScroll };
export { useBusuanzi } from './hooks/useBusuanzi';
export { useDayDiff, useTimeDiff } from './hooks/date';
export { useFileDownloader } from './hooks/useFileDownloader';
export { useScript } from './hooks/useScript';
export { useCopyToClipboard } from './hooks/useCopyToClipboard';
export { useWatermark } from './hooks/useWatermark';

// 默认导出
const exportDefault = {
    install,
    ...componentList,
    useBusuanzi,
    useDayDiff,
    useTimeDiff,
    useFileDownloader,
    useScript,
    useCopyToClipboard,
    useWatermark
};

export default exportDefault;