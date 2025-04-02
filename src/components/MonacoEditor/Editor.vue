<template>
  <div ref="codeEditBox" class="codeEditBox"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { editorProps } from './monacoEditorType'
import * as monaco from 'monaco-editor'

export default defineComponent({
  name: 'Editor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted'],
  setup(props, { emit }) {
    let editor: monaco.editor.IStandaloneCodeEditor
    const codeEditBox = ref()
    // 提取width和height属性，以便在样式中使用
    const width = computed(() => props.width)
    const height = computed(() => props.height)

    const init = () => {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false
      })
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true
      })

      editor = monaco.editor.create(codeEditBox.value, {
        value: props.modelValue,
        language: props.language,
        theme: props.theme,
        ...props.options
      })

      // 监听值的变化
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue() //给父组件实时返回最新文本
        emit('update:modelValue', value)
        emit('change', value)
      })

      // 确保编辑器布局正确更新
      setTimeout(() => {
        editor.layout()
      }, 100)

      emit('editor-mounted', editor)
    }
    watch(
      () => props.modelValue,
      newValue => {
        if (editor) {
          const value = editor.getValue()
          if (newValue !== value) {
            editor.setValue(newValue)
          }
        }
      }
    )

    watch(
      () => props.options,
      newValue => {
        editor.updateOptions(newValue)
      },
      { deep: true }
    )

    watch(
      () => props.language,
      newValue => {
        monaco.editor.setModelLanguage(editor.getModel()!, newValue)
      }
    )

    onBeforeUnmount(() => {
      editor.dispose()
    })

    onMounted(() => {
      init()

      // 监听窗口大小变化，更新编辑器布局
      window.addEventListener('resize', () => {
        if (editor) {
          editor.layout()
        }
      })
    })

    onBeforeUnmount(() => {
      // 移除窗口大小变化监听器
      window.removeEventListener('resize', () => {
        if (editor) {
          editor.layout()
        }
      })
    })

    return { codeEditBox, width, height }
  }
})
</script>

<style lang="scss" scoped>
.codeEditBox {
  position: relative;
  width: v-bind(width);
  height: v-bind(height);
  overflow: hidden;
}
</style>