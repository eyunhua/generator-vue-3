import {createApp} from 'vue';
import antd from 'config/antd.config';
import i18n from 'config/i18n.config';
import App from './App.vue';
import icons from './icons';
import router from './router';
import {store, key} from './store';
import 'assets/styles/base.less';

createApp(App)
    .use(store, key)
    .use(router)
    .use(i18n)
    .use(icons)
    .use(antd)
    .mount('#app');
