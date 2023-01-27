<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-img
          v-if="logo"
          :src="logo"
          fit="contain"
          width="10vw"
          :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
          no-spinner
          class="q-my-sm"
        />
        <div class="bar"></div>
        <q-img
          style="cursor: pointer; min-width: 150px"
          src="chavi_marca.png"
          fit="contain"
          :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
          no-spinner
          class="q-my-sm"
          @click="open('https://chavi.com.br', '_system')"
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
  methods: {
    open(url, target) {
      window.open(url, target);
    },
  },
});
</script>
<style scoped>
.bar {
  height: 40px;
  width: 2px;
  margin: 20px;
  background-color: black;
}
</style>
