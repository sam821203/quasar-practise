<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class='bg-white text-grey-10' bordered>
      <q-toolbar class='layout--main'>
        <q-btn to="/camera" size="16px" icon="eva-camera-outline" class="large-screen-only q-mt-sm" flat round dense />
        <q-separator class="large-screen-only" vertical spaced/>
        <q-toolbar-title class='text-grand-hotel text-bold'> Quasagram </q-toolbar-title>
        <q-btn to="/" size="16px" icon="eva-home-outline" class="large-screen-only q-mt-sm" flat round dense />
      </q-toolbar>
    </q-header>

    <q-footer class='bg-white small-screen-only' bordered>
      <q-tabs class='text-grey-10' active-color='primary' indicator-color='transparent'>
        <q-route-tab icon="eva-home-outline" to="/" exact />
        <q-route-tab
          icon="eva-camera-outline"
          to="/camera"
          exact
        />
      </q-tabs>
    </q-footer>

    <q-page-container class='bg-grey-1'>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<script setup>
// import { defineComponent, ref } from 'vue'
</script>

<style lang='scss'>
.q-footer {
  .q-tab__icon {
    font-size: 20px;
  }
}

.q-toolbar {
  @media (min-width: $breakpoint-sm-min) {
    height: 78px;
  }
}

.q-toolbar__title {
  font-size: 30px;
  @media (max-width: $breakpoint-xs-max) {
    text-align: center;
  }
}
</style>
