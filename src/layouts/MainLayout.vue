<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-center bg-grey-3">
        <q-toolbar-title class="flex flex-center q-gutter-x-xl">
          <q-img
            v-if="logo"
            :src="logo"
            fit="contain"
            width="10vw"
            style="min-width: 100px"
            no-spinner
          />

          <q-img
            src="chavi_marca.png"
            fit="contain"
            width="10vw"
            style="min-width: 100px"
            no-spinner
          />
        </q-toolbar-title>
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
          ? `${process.env.VUE_APP_API_URL}/StorageContainers/fotoImovel/download/` +
              logo
          : logo;
      },
    },
  },
});
</script>
