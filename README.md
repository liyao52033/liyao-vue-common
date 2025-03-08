# liyao-vue-common

基于 Vue 3 和 Element Plus 的上传组件库。

## 安装

```bash
pnpm install liyao-vue-common
```

## 使用方法

### 全局引入

```js
import { createApp } from 'vue'
import App from './App.vue'
import liyaoVueCommon from 'liyao-vue-common'
import 'liyao-vue-common/dist/style.css'

const app = createApp(App)
app.use(liyaoVueCommon)
app.mount('#app')
```

然后在组件中直接使用：

```html
<template>
  <uploadCos :uploadFileApi="yourUploadFunction" />
  <uploadLocal :importFile="yourImportFunction" />
</template>
```

### 按需引入

```js
import { uploadCos, uploadLocal } from 'liyao-vue-common'
import 'liyao-vue-common/dist/style.css'
```

然后在组件中注册和使用：

```html
<script>
import { uploadCos, uploadLocal } from 'liyao-vue-common'

export default {
  components: {
    uploadCos,
    uploadLocal
  }
}
</script>

<template>
  <uploadCos :uploadFileApi="yourUploadFunction" />
  <uploadLocal :importFile="yourImportFunction" />
</template>
```

## 组件说明

### uploadCos 组件

拖拽式文件上传组件，主要用于图片上传到对象存储服务（如COS、OSS等）。

#### 参数

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| uploadFileApi | Function | 是 | - | 上传文件的API函数 |
| modelValue | String | 否 | "" | 图片URL，支持v-model双向绑定 |
| maxFileSize | Number | 否 | 10 | 单个文件上传大小限制（单位：MB） |
| accept | String | 否 | "*" | 允许上传的文件类型，如 "image/png, image/jpeg" |
| dataPath | Array<String> | 否 | ['data'] | 数据在响应中的路径，如['result','url']表示取response.result.url |

#### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 默认插槽，可自定义拖拽区域内容 |
| tip | 提示信息插槽，显示在上传区域下方 |

#### 使用示例

 基本使用

```vue
<uploadCos v-model="imageUrl" :uploadFileApi="uploadToServer" />
```

带参数使用

```vue
<uploadCos 
  v-model="imageUrl" 
  :uploadFileApi="uploadToServer" 
  :maxFileSize="5"
  accept="image/png, image/jpeg"
  :dataPath="['result', 'path']"
/>
```

使用插槽自定义内容

```vue
<template>
  <div>
    <uploadCos :uploadFileApi="uploadToServer">
      <!-- 自定义上传区域 -->
      <template #default>
        <div class="custom-upload-area">
          <i class="el-icon-upload"></i>
          <div>点击或拖拽图片到此区域上传</div>
        </div>
      </template>
      
      <!-- 自定义提示信息 -->
      <template #tip>
        <div class="custom-tip">支持jpg、png格式，文件小于5MB</div>
      </template>
    </uploadCos>
  </div>
</template>

<script setup>
// 上传函数示例
function uploadToServer(file: File) {
   const formData = new FormData();
   formData.append("file", file);
   formData.append("biz", "user_avatar");
   return request({
     url: "/api/cos/upload",
     method: "post",
     data: formData,
     headers: {
       "Content-Type": "multipart/form-data",
     },
   });
 }
</script>
```



### uploadLocal 组件

按钮式文件上传组件

#### 参数

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| importFile | Function | 是 | - | 导入文件处理函数，接收文件对象作为参数 |
| allowedExtensions | Array | 否 | [] | 允许的文件扩展名，如 ['.xlsx', '.xls', '.csv'] |
| maxFileSize | Number | 否 | 10 | 单个文件上传大小限制（单位：MB） |
| acceptType | String | 否 | "*" | 允许上传的文件类型 |

#### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 默认插槽，用于自定义上传按钮文本 |
| trigger | 触发按钮插槽，可完全自定义上传按钮 |

#### 使用示例

基本使用

```vue
 <uploadLocal :importFile="handleImportFile">
      导入Excel
    </uploadLocal>
```

带参数使用

```vue
<uploadLocal 
    :importFile="handleImportFile"
    :allowedExtensions="['.xlsx', '.xls', '.csv']"
    :maxFileSize="20"
    acceptType=".xlsx,.xls,.csv"
>
   导入
</uploadLocal>
```

使用插槽自定义内容

```vue
<template>
  <div>
    <uploadLocal :importFile="handleImportFile">
      <!-- 自定义按钮文本 -->
      点击导入数据文件
    </uploadLocal>
    
    <!-- 完全自定义按钮 -->
    <uploadLocal :importFile="handleImportFile">
      <template #trigger>
        <el-button type="success" icon="el-icon-upload">
          导入数据
        </el-button>
      </template>
    </uploadLocal>
  </div>
</template>

<script setup>
// 处理导入Excel文件
const handleImportFile = (file) => {
  console.log('处理导入的文件:', file.name)
  // 实际项目中在这里处理Excel文件
  console.log('文件大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB')
  console.log('文件类型:', file.type)
}
</script>
```

#### 使用uploadLocal实现uploadCos的UI

可以通过利用uploadLocal组件的插槽功能，实现与uploadCos相似的UI效果：

```vue
<template>
  <div>
    <uploadLocal :importFile="handleFileUpload">
      <template #trigger>
        <div class="el-upload-dragger">
          <el-icon class="el-upload-icon" size="100">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">拖拽或 <em>点击上传</em></div>
          <img v-if="imageUrl" :src="imageUrl" alt="img" class="preview-img" />
        </div>
      </template>
    </uploadLocal>
  </div>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { ref } from 'vue';

const imageUrl = ref('');

// 处理文件上传的函数
const handleFileUpload = async (file) => {
  // 调用你的上传API
  try {
    const response = await yourUploadFunction(file);
    imageUrl.value = response.data; // 根据你的API响应结构调整
  } catch (error) {
    console.error('上传失败', error);
  }
}
</script>

<style>
.preview-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
```

## 开发指南

### 添加新组件

1. 在 `src/components` 目录下创建新组件
2. 在 `src/components/base/index.ts` 文件中添加组件:

```js
// 导入新组件
import uploadCos from '../Upload/uploadCos.vue';
import uploadLocal from '../Upload/uploadLocal.vue';
import newComponent from '../Your/NewComponent.vue'; // 添加新组件导入

// 组件注册表 - 只需要在这里添加新组件
const componentList = {
    uploadCos,
    uploadLocal,
    newComponent // 添加新组件到注册表
};
```

3. 在 `types/index.d.ts` 文件中添加类型声明，需要在**四个地方**添加:

```ts
// 1. 导入时的组件类型定义
declare module 'liyao-vue-common' {
    export const uploadCos: DefineComponent<{}, {}, any>;
    export const uploadLocal: DefineComponent<{}, {}, any>;
    export const newComponent: DefineComponent<{}, {}, any>; // 添加新组件类型
    export const install: (app: App) => void;
}

// 2. Vue 全局组件类型定义
declare module 'vue' {
    export interface GlobalComponents {
        uploadCos: DefineComponent<{}, {}, any>;
        uploadLocal: DefineComponent<{}, {}, any>;
        newComponent: DefineComponent<{}, {}, any>; // 添加全局组件类型
    }
}

// 3. 组件文件模块声明
declare module '@/components/Upload/uploadCos.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@/components/Upload/uploadLocal.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 添加新组件的模块声明
declare module '@/components/Your/NewComponent.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 4. 默认导出
declare const _default: {
    install: (app: App) => void;
    uploadCos: DefineComponent<{}, {}, any>;
    uploadLocal: DefineComponent<{}, {}, any>;
    newComponent: DefineComponent<{}, {}, any>; // 添加默认导出类型
};
```

4. 更新版本号并发布:

```bash
# 修改 package.json 中的版本号
pnpm pub
```
