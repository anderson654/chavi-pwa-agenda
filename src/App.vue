<template>
  <router-view class="igual-font" />
</template>
<script>
import { defineComponent } from "vue";
import { install } from "resize-observer";
export default defineComponent({
  name: "App",
  async beforeCreate() {
    await new Promise(async (resolve, reject) => {
      try {
        let keys = await caches.keys();
        for (let key of keys) {
          caches.delete(key);
        }
        resolve();
      } catch {
        resolve();
      }
    });
  },
  created() {
    install();
    this.checkConnectionStatus();
  },
});
</script>
<style scoped>
@import "./css/global.css";

@font-face {
  font-family: poppins;
  src: url("../public/fonts/Poppins/Poppins-Medium.ttf");
}
@font-face {
  font-family: igual;
  src: url("../public/fonts/Igual/Igual-Medium.otf");
}
.igual-font{
  font-family: "igual";
}
.poppins-font {
  font-family: "poppins";
}
</style>
