<template>
  <router-view class="poppins-font" />
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
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
