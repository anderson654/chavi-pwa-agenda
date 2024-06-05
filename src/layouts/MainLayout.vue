<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-3">
      <q-toolbar class="header-toolbar flex flex-center flex-justify-between q-gutter-x-md full-width">
        <div>
          <p> </p>
        </div>
        <div class="header flex flex-center">
          <q-img
            :src="nomeCoworkingLocal"
            fit="contain"
            width="150px"
            :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
            no-spinner
            class="q-my-sm"
          />
        </div>
        <div>
          <q-btn
            v-if="logado"
            style="font-size: 1rem"
            label="Logout"
            flat
            dense
            color="secondary"
            class="home-icon"
            @click="logout()"
          />
        </div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from 'vuex';
import { Dialog } from "quasar";


export default defineComponent({
  name: "MainLayout",
  data(){
    return{
      coworkingNome: ""
    }
  },
  computed: {
    ...mapGetters(['coworkingNome']),
    nomeCoworkingLocal() {
      this.pegarCoworkingNome()
      return this.coworkingNome;
    },
    routeCoworking() {
      let nome = this.coworkingNome
      nome = nome.split(".")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ")[0]
      if(nome == "hotmilk"){
        return "hotmilk/agenda"
      }else if(nome == "pinhao"){
        return "pinhaohub"
      }else{
        return nome
      }
    },
    login: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getLogin));
      },
      set(value) {
        const key = "setLogin";
        this.$store.dispatch("setarDados", { key: key, value: value });
      },
    },
    logado(){
      if(this.login && this.login.user){
        return true
      }else{
        return false
      }
    },
    logo: {
      set(value) {
        this.$store.dispatch("setarDados", { key: "setLogo", value: value });
      },
      get() {
        const logo = this.$store.getters.getCowokingNome;
        if (!logo) return false;
        if(logo){
          return `${logo}.png`
        }else{
          return ""
        }
      },
    },
  },
  mounted(){
        
    this.pegarCoworkingNome()

  },
  methods: {
    open(url, target) {
      window.open(url, target);
    },
    pegarCoworkingNome(){
      let nome = this.$store.getters.getCoworkingNome
      if(nome && "home" == this.$route.path.split("/")[1]){
        this.coworkingNome = nome + ".png";
        this.alterarEstilo(nome);
      }else if(nome){
        this.coworkingNome = nome + ".png";
        this.alterarEstilo(nome);
      }else{
        let nomeCoworking = this.$route.path.split("/")[1];
        this.coworkingNome = this.$route.path.split("/")[1] +".png"
        this.alterarEstilo(nomeCoworking);
      }
    },
    alterarEstilo(elementEstilo) {

      let root = document.querySelector(":root")
      let listEstilos = root.classList;

      if (listEstilos.length > 0)
      {
        let atual = false;
        for (let index = 0; index < listEstilos.length; index++) {
          let element = listEstilos[index];         
         
          if (element != 'chavi')
          {
            if (element == elementEstilo){
              atual = true;
            }   
            else{
            
              root.classList.remove(root.classList.item(index));     
            }         
        
          }
        }
        if(!atual){        
          root.classList.toggle(elementEstilo);
        }
      }
      else{
        root.classList.toggle(elementEstilo);
      }

    },
    async logout(force) {
      if (force) {
        await this.$store.dispatch("setarDados", {
          key: "setLogin",
          value: [],
        });

        this.$store.dispatch("setarDados", {
          key: "setEstadoInicial",
          value: true,
        });

        return;
      }
      Dialog.create({
        title: "Aviso",
        message: `<p>Retornar para a tela inicial?</p> <p>Você irá deslogar</p>`,
        html:true,
        ok: {
          label: "Sim",
          color: "positive",
        },
        cancel: {
          label: "Não",
          color: "negative",
        },
      }).onOk(async () => {
        await this.$store.dispatch("setarDados", {
          key: "setLogin",
          value: [],
        });
        this.telaInicial()
      });
    },
    async telaInicial() {
      await this.$store.dispatch("setarDados", { key: "setParams", value: {} });
      await this.$store.dispatch("setarDados", { key: "setLogo", value: "" });
      this.semImovel = true;
      this.$router.push(`/${this.routeCoworking}`);
    },
  },
  
});
</script>
<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bar {
  height: 40px;
  width: 2px;
  margin: 20px;
  background-color: black;
  background-color: #505050;
}
.header-toolbar {
  justify-content: space-between;
}

.right {
  margin-left: auto;
}

</style>
