<template>
    <md-dialog :md-active="show">
      <md-dialog-title>{{ title }}</md-dialog-title>
      <md-dialog-content>
        {{ message }}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog">Aceptar</md-button>
      </md-dialog-actions>
    </md-dialog>
  </template>
  
  <script>
  export default {
    name: 'DialogMessage',
    props: {
      title: String,
      message: String,
      show: Boolean
    },
    methods: {
      closeDialog() {
        this.$emit('update:show', false);
      }
    }
  };
  </script>
  