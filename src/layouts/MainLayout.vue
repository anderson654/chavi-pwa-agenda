<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-img
          v-if="logo"
          :src="logo"
          fit="contain"
          width="10vw"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
        />
        <q-img
          src="chavi_marca.png"
          fit="contain"
          width="10vw"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  computed: {
    logo: {
      set(value) {
        this.$store.dispatch("setarDados", { key: "setLogo", value: value });
      },
      get() {
        const logo = this.$store.getters.getLogo;
        if (!logo) return false;
        return !logo.includes("http")
          ? `${process.env.VUE_APP_API_URL}/StorageContainers/logoEntidade/download/` +
              logo
          : logo;
      },
    },
  },
});
</script>
