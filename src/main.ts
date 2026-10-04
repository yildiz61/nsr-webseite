import { createApp } from 'vue'
import './styles/base.css'
import App from './App.vue'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createApp(App).mount('#app')
