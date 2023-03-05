import {createApp} from 'vue'
import App from './App.vue'
import install from './install'
import './permission'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import 'virtual:svg-icons-register'
import './init.js'

const app = createApp(App)
app.use(install)
app.mount('#app')
