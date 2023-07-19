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
    this.adicionarCreditosExtras()
    this.$router.push("/home");  
  },
  methods:{
    async adicionarCreditosExtras(){
      if(this.$route.query.collection_status === "approved"){
        let data = {
          entidade: this.getLogin.user.entidadeId,
          creditos: this.$store.getters.getExtra,
          entidadeCoworking: this.$store.getters.getImovelAgendamento.entidadeId
        }
        if(data.creditos > 0){
          let response = await this.executeMethod({
              url: `Entidades/adicionarCreditosExtras`,
              method: "post",
              data: data
            });
          if(response && response.status == 200){
            this.$store.dispatch("setarDados", { key: "setExtra", value: 0 });
          }
        }else{
          return
        }
      }else{
        return
      }
    },
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
        if(nome == "habitat"){
          nome = "habitatsenai"
        }
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
