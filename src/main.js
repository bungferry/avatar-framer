import { createApp } from 'vue'
import App from './App.vue'
import VueSocialSharing from 'vue-social-sharing'

const app = createApp(App);

app.use(VueSocialSharing);
app.mount('#app');
