<script setup>
import { ref, shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}

const code = ref('')
const editorRef = shallowRef()
const handleMount = editor => (editorRef.value = editor)
</script>

<template>
  <div class="title-container">Demo</div>
  <div class="editor-container">
    <vue-monaco-editor 
      v-model:value="code" 
      theme="vs-dark" 
      :options="MONACO_EDITOR_OPTIONS" 
      @mount="handleMount" 
      :width="300"
      :height="400"
      :language="'c'"
      class="editor"
    />
  </div>
</template>

<style scoped>
.title-container {
  margin-left: 20vw;
  margin-right: 20vw;
  font-family: Arial, Helvetica, sans-serif;
}

.editor {
  min-width: 50%;
  min-height: 400px;
  margin-left: 20vw;
  margin-right: 20vw;
}

</style>