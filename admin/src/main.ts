import {createApp} from 'vue'
import App from './App.vue'
import install from './install'
import './permission'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import 'virtual:svg-icons-register'
import './init.js'
import VueCodemirror from 'vue-codemirror'
import { basicSetup } from 'codemirror'

const app = createApp(App)
app.use(install)
app.use(VueCodemirror, {
    // optional default global options
    autofocus: true,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    placeholder: '从这里编写代码...',
    extensions: [basicSetup]
})
app.mount('#app')
