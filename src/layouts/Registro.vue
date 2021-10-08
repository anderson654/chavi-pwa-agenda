<template>
  <q-layout view="hHr LpR lFf" class="Background">
    <q-page-container>
      <q-page padding> </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Notify, Dialog, Loading } from "quasar";

export default {
  created: function () {
    Loading.show({ message: "Carregando", delay: 400 });
    // 605e23666d9f030c2e6444ea
    // Casa
    let myParams = this.$route.params;

    this.$store.dispatch("setarDados", { key: "setParams", value: myParams });

    Loading.hide();

    this.$router.push("/");
  },
};
</script>

<style></style>
