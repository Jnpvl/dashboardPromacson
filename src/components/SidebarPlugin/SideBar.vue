<template>
  <div
    class="sidebar"
    :data-color="sidebarItemColor"
    :data-image="sidebarBackgroundImage"
    :style="sidebarStyle"
  >
    <div class="logo">
      <a href="#" class="simple-text logo-mini">
        <div class="logo-img">
          <img :src="imgLogo" alt="" />
        </div>
      </a>

      <a
        class="simple-text logo-normal"
      >
      {{ fullName }}
      </a>
    </div>
    <div class="sidebar-wrapper">
      <slot name="content"></slot>
      <md-list class="nav">
        <slot>
          <sidebar-link
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :to="link.path"
            :link="link"
          >
          </sidebar-link>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
import SidebarLink from "./SidebarLink.vue";

export default {
  components: {
    SidebarLink,
  },
  props: {
    title: {
      type: String,
      default: "Nombre de usuario",
    },
    sidebarBackgroundImage: {
      type: String,
      default: require("@/assets/img/sidebar-2.jpg"),
    },
    imgLogo: {
      type: String,
      default: require("@/assets/img/logo.png"),
    },
    sidebarItemColor: {
      type: String,
      default: "green",
      validator: (value) => {
        let acceptedValues = ["", "purple", "blue", "green", "orange", "red"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  data() {
    return {
      user: this.getUserFromLocalStorage(),
    };
  },
  methods:{
    getUserFromLocalStorage() {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString).usuario : null;
    },
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.sidebarBackgroundImage})`,
      };
    },
    fullName() {
      return this.user ? `${this.user.nombre} ${this.user.apellido}` : 'Nombre de usuario';
    },
  },
};
</script>
<style>
@media screen and (min-width: 991px) {
  .nav-mobile-menu {
    display: none;
  }
}
</style>
