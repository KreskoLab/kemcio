import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import App from './App.vue'
import 'virtual:windi.css'

const app = createApp(App).use(router).use(createPinia()).use(VueAxios, axios)

app.axios.defaults.baseURL = import.meta.env.VITE_API as string
app.axios.defaults.withCredentials = true

app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

app.mount('#app')
