import { defineStore } from "pinia";

type Theme = 'light' | 'dark'

export const useMain = defineStore('main', {
  state: () => {
    return {
      theme: '' as Theme,
      counter: 0
    }
  },
  actions: {
    setTheme(newTheme: Theme) {
      this.theme = newTheme
    },

    updateCounter() {
      this.counter++
    }
  }
})