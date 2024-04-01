import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Maps from "@/pages/Maps.vue";
import Login from "@/pages/LoginView.vue";
import User from "@/pages/UsersView.vue";
import Orders from "@/pages/OrdersView.vue";
import OrderDetails from "@/components/OrderDetails.vue"



import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      {
        path: "users",
        name: "Listado de Usuarios",
        component: User,
        meta: { requiresAuth: true },
      },
      {
        path: "orders",
        name: "Listado de Pedidos",
        component: Orders,
        meta: { requiresAuth: true },
      },
      {
        path: "orders/:folio", 
        name: "Detalles del pedido",
        component: OrderDetails,
        meta: { requiresAuth: true },
      },
      {
        path: "maps",
        name: "Maps",
        meta: {
          hideFooter: true,
        },
        component: Maps,
        meta: { requiresAuth: true },
      },
      
    ],
  },
];

const router = new Router({
  mode: 'hash', 
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const loggedIn = localStorage.getItem('user');

  if (requiresAuth && !loggedIn) {
    next('/login');
  } else if (loggedIn && to.path === '/login') {
    next('/');
  } else {
    next();
  }
});

export default router; 

