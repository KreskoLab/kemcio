import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router' 
import App from'./App.vue' 
import 'virtual:windi.css' 

createApp(App).use(router).use(createPinia()).use(VueAxios, axios).mount('#app')
