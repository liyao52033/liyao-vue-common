<template>
  <el-button link :style="style" @click="handleClipboard">
    <!-- 使用插槽进行自定义内容，可以在按钮内显示图标或文本 -->
    <slot>
      <el-icon>
        <!-- 文档复制图标 -->
        <DocumentCopy color="var(--el-color-primary)" />
      </el-icon>
    </slot>
  </el-button>
</template>

<script setup lang="ts">
import { DocumentCopy } from "@element-plus/icons-vue";

defineOptions({
  name: "CopyButton",  // 组件名称
  inheritAttrs: false,  // 不继承父组件的属性
});

// 定义组件的 props
const props = defineProps({
  text: {
    type: String,
    default: "",  // 要复制的文本
  },
  style: {
    type: Object,
    default: () => ({}),  // 自定义样式
  },
});

// 复制操作处理函数
function handleClipboard() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // 如果浏览器支持 Clipboard API
    navigator.clipboard
      .writeText(props.text)
      .then(() => {
        // 成功后显示提示消息
        ElMessage.success("复制成功");
      })
      .catch((error) => {
        // 复制失败时显示警告
        ElMessage.warning("复制失败");
        console.log("[CopyButton] Copy failed", error);
      });
  } else {
    // 如果浏览器不支持 Clipboard API，使用兼容方法
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.setAttribute("value", props.text);
    document.body.appendChild(input);
    input.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        ElMessage.success("复制成功");
      } else {
        ElMessage.warning("复制失败");
      }
    } catch (err) {
      ElMessage.error("复制失败");
      console.log("[CopyButton] Copy failed.", err);
    } finally {
      // 清理临时创建的 input 元素
      document.body.removeChild(input);
    }
  }
}
</script>
