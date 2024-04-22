import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { editors } from '../configs/editors'

const defaultEditor = editors[0].id;

export const useSettingsStore = defineStore('settings',  () => {
  const filepathLinkBehaviour = ref(localStorage.getItem('railspanel.filepathLinkBehaviour') || 'copy');
  const editor = ref(editors.find((e) => e.id == (localStorage.getItem('railspanel.editor') || defaultEditor)) || defaultEditor);

  watch(editor, (newVal, oldVal) => {
    localStorage.setItem('railspanel.editor', newVal.id);
  });

  watch(filepathLinkBehaviour, (newVal, oldVal) => {
    localStorage.setItem('railspanel.filepathLinkBehaviour', newVal);
  });

  return { 
    editors,
    editor,
    filepathLinkBehaviour
  }
})