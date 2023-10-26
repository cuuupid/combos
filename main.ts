import { createApp } from '@vue/runtime-dom'
import App from '@Muse/App.vue'
import router from '@Muse/router/index'
import LottieAnimation from "lottie-web-vue";
import '@Muse/assets/css/base.css'

createApp(App)
	.use(router)
	.use(LottieAnimation)
	.mount('#app')
