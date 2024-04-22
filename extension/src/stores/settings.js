import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { editors } from '../configs/editors'

export const useSettingsStore = defineStore('settings',  () => {
  const filepathLinkBehaviour = ref(localStorage.getItem('railspanel.filepathLinkBehaviour') || 'open');
  const editor = ref(editors.find((e) => e.id == (localStorage.getItem('railspanel.editor') || editors[0].id)));

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