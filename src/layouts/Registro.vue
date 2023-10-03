<template>
  <q-layout view="hHr LpR lFf">
    <q-page-container>
      <q-page padding> </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Loading } from "quasar";

export default {
  created: function () {
    Loading.show({ message: "Carregando", delay: 400 });
    let myParams = this.$route.params;
    let query = this.$route.query;
    this.$store.dispatch("setarDados", { key: "setParams", value: myParams });
    if (query && query.login) {
      this.$store.dispatch("setarDados", {
        key: "setLogin",
        value: JSON.parse(query.login),
      });
    }
    this.carregarInfoLogo()
    
  },
  methods:{
    async carregarInfoLogo(){
      let nome
      const response = await this.executeMethod({
            url: "Visitas/horariosOcupados",
            method: "GET",
            params: {
              clienteId: this.$route.params.entidadeId,
              imovelRef: this.$route.params.imovelRef,
            },
          });
          if (response && response.status == 200) {
            nome = response.data.entidade.nome
            nome = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ")[0]
          }else {
            nome = ""
          }
      this.$store.dispatch("setarDados", {
        key: "setCoworkingNome",
        value: nome,
      });
      Loading.hide();
      this.$router.push("/home");

    }
  }
};
</script>
