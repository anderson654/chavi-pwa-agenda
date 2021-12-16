<template>
  <router-view class="poppins-font" />
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
        console.log("KEYS ", keys);
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
  },
});
</script>
<style scoped>
@font-face {
  font-family: poppins;
  src: url("../public/fonts/Poppins/Poppins-Medium.ttf");
}
.poppins-font {
  font-family: "poppins";
}
</style>
