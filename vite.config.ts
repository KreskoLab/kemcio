import { defineConfig } from 'vite' 
import WindiCSS from 'vite-plugin-windicss'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

export default defineConfig({ 
  plugins: [
    vue({
      reactivityTransform: true
    }), 
    WindiCSS(), 
    Components({
      resolvers: [
        IconsResolver(),
      ],
    }), 
     Icons()
  ],
  
  preview: {
    port: 3000
  },

  resolve:{
    alias:{
      '@' : path.resolve(__dirname, './src')
    },
  },
})
