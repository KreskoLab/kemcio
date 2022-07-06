import { defineStore } from "pinia";

type Theme = 'light' | 'dark'

export const useMain = defineStore('main', {
  state: () => {
    return {
      theme: '' as Theme
    }
  },
  actions: {
    setTheme(newTheme: Theme) {
      this.theme = newTheme
    }
  }
})