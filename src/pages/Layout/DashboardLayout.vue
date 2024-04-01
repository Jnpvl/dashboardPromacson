<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">

    <side-bar :sidebar-item-color="sidebarBackground" :sidebar-background-image="sidebarBackgroundImage">
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/users">
        <md-icon>person</md-icon>
        <p>Usuarios</p>
      </sidebar-link>
      <sidebar-link to="/orders">
        <md-icon>list</md-icon>
        <p>Pedidos</p>
      </sidebar-link>
      <sidebar-link to="/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link>

      

      
      <div class="logout-container">
      <a @click.prevent="cerrarSesion" class="sidebar-link logout-link">
        <md-icon>exit_to_app</md-icon>
        <p class="p">Cerrar sesión</p>
      </a>
    </div>
    </side-bar>

    



    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin :color.sync="sidebarBackground" :image.sync="sidebarBackgroundImage">
      </fixed-plugin>

      <dashboard-content> </dashboard-content>

      <!--<content-footer v-if="!$route.meta.hideFooter"></content-footer>   -->
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
//import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import FixedPlugin from "./Extra/FixedPlugin.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    // ContentFooter,
    FixedPlugin,
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
};
</script>


<style scoped>
.logout-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 2rem;
}

.logout-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 14px;
  color: #FFFFFF;
}

.logout-link md-icon {
  margin-right: 15px;
}

.sidebar-link {
  display: flex;
  align-items: center;
}
.logout-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.p{
  color: white;
}
</style>