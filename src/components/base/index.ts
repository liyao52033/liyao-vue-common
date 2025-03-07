import type { App } from 'vue'

import uploadCos from '../Upload/uploadCos.vue';
import uploadLocal from '../Upload/uploadLocal.vue';

// 后面添加的组件就可以逐个添加进入这个数组里了
const components =[
    uploadCos, uploadLocal
]

// 组件库全局 install 方法
const install = (app: App): void => {
    components.forEach((component) => {
        app.component(component.name!, component);
    });
};

export default { install };

export { uploadCos, uploadLocal };