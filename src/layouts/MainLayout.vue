<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <div class="header">
          <q-img
            :src="nomeCoworkingLocal"
            fit="contain"
            width="150px"
            :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
            no-spinner
            class="q-my-sm"
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

    }
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
</style>
