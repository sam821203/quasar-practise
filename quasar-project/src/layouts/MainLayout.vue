<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="layout--main">
        <q-btn
          to="/camera"
          size="16px"
          icon="eva-camera-outline"
          class="large-screen-only q-mt-sm"
          flat
          round
          dense
        />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasagram
        </q-toolbar-title>
        <q-btn
          to="/"
          size="16px"
          icon="eva-home-outline"
          class="large-screen-only q-mt-sm"
          flat
          round
          dense
        />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="banner-container bg-primary" v-if="showAppInstallBanner">
          <div class="layout--main">
            <q-banner inline-actions dense class="bg-primary text-white">
              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  text-color="primary"
                  icon="eva-camera-outline"
                  font-size="16px"
                />
              </template>
              <b>Install Quasagram ?</b>
              <template v-slot:action>
                <q-btn
                  flat
                  label="Yes"
                  class="q-px-sm"
                  dense
                  @click="installApp"
                />
                <q-btn
                  flat
                  label="Later"
                  class="q-px-sm"
                  dense
                  @click="hideBanner"
                />
                <q-btn
                  flat
                  label="Never"
                  class="q-px-sm"
                  dense
                  @click="neverShowAppInstallBanner"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab icon="eva-home-outline" to="/" exact />
        <q-route-tab icon="eva-camera-outline" to="/camera" exact />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
const $q = useQuasar();

let deferredPrompt;
const showAppInstallBanner = ref(false);

const hideBanner = () => (showAppInstallBanner.value = false);

const neverShowAppInstallBanner = () => {
  // 關閉 banner
  showAppInstallBanner.value = false;

  // 傳送 Never 結果到使用者的 localStorage
  $q.localStorage.set("neverShowAppInstallBanner", true);
};

const installApp = async () => {
  // Hide the app provided install promotion
  showAppInstallBanner.value = false;
  // Show the install prompt
  await deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    neverShowAppInstallBanner();
  }
  // deferredPrompt = null;
};

onMounted(() => {
  // 取得 neverShowAppInstallBanner 的狀態值
  const neverShowStatus = $q.localStorage.getItem("neverShowAppInstallBanner");

  if (!neverShowStatus) {
    // Initialize deferredPrompt for use later to show browser install prompt.
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;

      // setTimeout(() => {
      //   // Update UI notify the user they can install the PWA
      //   showAppInstallBanner.value = true;
      // }, 3000);

      showAppInstallBanner.value = true;
    });
  }
});
</script>

<style lang="scss" scoped>
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
