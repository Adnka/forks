import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify/lib';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.use(Vuetify,{
  theme: {
      primary: '#000000',
      secondary: '#424242',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107'
    }
});


new Vue({
  router,
  store,
  Vuetify,
  vuetify,
  render: h => h(App)
}).$mount('#app')
