import Vue from "vue";
import App from "./App";

import router from "./routes/routes";
import store from "./stores/store"; 


import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";


import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

Vue.prototype.$Chartist = Chartist;

Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);

new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store, 
  data: {
    Chartist: Chartist,
  },
});
