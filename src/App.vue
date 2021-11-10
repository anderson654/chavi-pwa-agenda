<template>
  <router-view class="poppins-font" />
</template>
<script>
import { defineComponent } from "vue";
import { install } from "resize-observer";
export default defineComponent({
  name: "App",
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
