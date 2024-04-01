import Vue from 'vue';
import Vuex from 'vuex';
import orderService from '../services/orderService';
import userService from '../services/userService';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pedidos: [],
    usuarios: [],
    pedidoActual: {}
  },
  mutations: {
    SET_PEDIDO_ACTUAL(state, pedido) {
      state.pedidoActual = pedido; 
    },
    SET_PEDIDOS(state, pedidos) {
      state.pedidos = pedidos;
    },
    ADD_PEDIDO(state, pedido) {
      state.pedidos.push(pedido);
    },
    DELETE_PEDIDO(state, folio) {
      state.pedidos = state.pedidos.filter(pedido => pedido.folio !== folio);
    },
    UPDATE_PEDIDO(state, pedidoActualizado) {
      const index = state.pedidos.findIndex(pedido => pedido.folio === pedidoActualizado.folio);
      if (index !== -1) {
        Vue.set(state.pedidos, index, pedidoActualizado);
      }
    },


    SET_USUARIOS(state, usuarios) {
      state.usuarios = usuarios;
    },
    ADD_USUARIOS(state, usuario) {
      state.usuarios.push(usuario)
    },
    DELETE_USUARIO(state, id) {
      state.usuarios = state.usuarios.filter(usuario => usuario.id !== id);
    },
    UPDATE_USUARIO(state, usuarioActualizado) {
      const index = state.usuarios.findIndex(usuario => usuario.id === usuarioActualizado.id);
      if (index !== -1) {
        Vue.set(state.usuarios, index, usuarioActualizado);
      }
    },

  },
  actions: {
    async fetchDetallePedido({ commit }, folio) {
      try {
        const pedido = await orderService.getDetallesPedido(folio);
        commit('SET_PEDIDO_ACTUAL', pedido);
        console.log('store', JSON.stringify(pedido, null, 2));
      } catch (error) {
        console.error('Error al obtener detalles del pedido:', error);
      }
    },
    
    async fetchPedidos({ commit }) {
      try {
        const pedidos = await orderService.getPedidos();
        commit('SET_PEDIDOS', pedidos);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    },
    async createPedido({ dispatch }, pedido) {
      try {
        await orderService.crearPedido(pedido);
        dispatch('fetchPedidos');
      } catch (error) {
        console.error('Error al crear pedido:', error);
      }
    },
    async deletePedido({ commit }, folio) {
      try {
        await orderService.deletePedido(folio);
        commit('DELETE_PEDIDO', folio)
      } catch (error) {
        console.error('Error al eliminar pedido:', error)
      }
    },
    async updatePedido({ commit }, { folio, pedido }) {
      try {
        const response = await orderService.actualizarPedido(folio, pedido);
        commit('UPDATE_PEDIDO', response.pedido);
      } catch (error) {
        console.error('Error al actualizar pedido:', error);
        throw error;
      }
    },


    async fetchUsuarios({ commit }) {
      try {
        const usuarios = await userService.getUsuarios();
        commit('SET_USUARIOS', usuarios);
      } catch (error) {
        console.log('Error al obtener clientes:', error)
      }
    },
    async createUsuario({ dispatch }, usuario) {
      try {
        await userService.crearUsuario(usuario);
        dispatch('fetchUsuarios');
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
    },
    async deleteUsuario({ commit }, id) {
      try {
        await userService.deleteUsuario(id);
        commit('DELETE_USUARIO', id);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    },
    async updateUsuario({ commit }, { id, usuario }) {
      try {
        const response = await userService.actualizarUsuario(id, usuario);
        commit('UPDATE_USUARIO', response.usuario);
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
      }
    }

  },
});
