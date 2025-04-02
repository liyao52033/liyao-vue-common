<template>
  <div class="flex-y-center gap-2">
    <el-tag
        v-for="tag in tags"
        :key="tag"
        closable
        :disable-transitions="false"
        v-bind="config.tagAttrs"
        @close="handleClose(tag)"
        style="margin: 0 5px"
    >
      {{ tag }}
    </el-tag>
    <el-input
        v-if="inputVisible"
        ref="inputRef"
        v-model.trim="inputValue"
        @keyup.enter.stop.prevent="handleInputConfirm"
        @blur.stop.prevent="handleInputConfirm"
    />
    <el-button type="primary" v-else v-bind="config.buttonAttrs" @click="showInput">
      {{ config.buttonAttrs.btnText ? config.buttonAttrs.btnText : "+ New Tag" }}
    </el-button>
  </div>
</template>
<script setup lang="ts">
import type { InputInstance } from "element-plus";

const inputValue = ref("");
const inputVisible = ref(false);
const inputRef = ref<InputInstance>();

// 定义 model，用于与父组件的 v-model绑定
const tags = defineModel<string[]>();

// 修改后的props类型定义
defineProps({
  config: {
    type: Object as () => {
      buttonAttrs?: Record<string, any>;
      inputAttrs?: Record<string, any>;
      tagAttrs?: Record<string, any>;
    },
    default: () => ({
      buttonAttrs: {}, //可配置 el-button 的所有 props 和自定义属性
      inputAttrs: {},  //可配置 el-input 的所有 props 和自定义属性：
      tagAttrs: {},    //可配置 el-tag 的所有 props 和自定义属性：
    }),
  },
});


const handleClose = (tag: string) => {
  if (tags.value) {
    const newTags = tags.value.filter((t) => t !== tag);
    tags.value = [...newTags];
  }
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => inputRef.value?.focus());
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    tags.value = [...(tags.value || []), inputValue.value];
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>