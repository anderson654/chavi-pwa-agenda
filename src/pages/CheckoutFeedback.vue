<template>
  <q-layout view="lHh Lpr lFf">
    

    <q-page-container style="padding-top: 10px">
      <q-page padding>
        <div class="container">
          <div class="box-text" style="padding-left: 8px; padding-right: 8px">
            <span>Sua solicitação de Agendamento! Foi enviado com Sucesso! </span>           
          </div>
        </div>

        <div class="full-width text-center text-black text-h5 q-mt-lg"></div>
        <div class="full-width flex flex-center" style="margin-top: 30px">
          <div
            class="text-center column q-gutter-lg full-width q-py-xs q-pb-xl"
            style="border-radius: 20px"
          >
            <div class="container">
              <div class="box">
                <div
                  style="width: 300px; padding-left: 8px; padding-right: 8px"
                >
                <span>Aguarde a confirmacão do
                  <span class="text">pagamento</span>.
                </span>

                  <p>Você receberá uma mensagem </p>
                  <p>via WhatsApp!</p>
                  <p>Sobre o agendamento da sala.</p>
                  <p>{{ nomeImovel }}</p>
                  <p>
                    Atenciosamente,
                  </p> 
                   <p>
                    Equipe Chavi.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <form action="https://chavi.com.br/app">
                <q-btn
                  class="q-pa-sm text-bold"
                  color="primary"
                  text-color="white"
                  label="Voltar para o calendário"
                  @click=aceitarMensagem
                />
              </form>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
    <footer>
      <div
      style="
          height: 40px;
          width: 100%;
          color: white;
          text-align: center; 
          background-color: 
          rgba(240, 240, 240, 0.9);"
      >
      <div class="bg-grey-3 footer flex flex-center">
        <div class="footer-content">
          <span style="color: #505050;">Desenvolvido por</span>
          <q-img
            src="chavi_marca.png"
            fit="contain"
            width="100px"
            :style="$q.platform.is.desktop ? 'width: 100px' : 'width: 80px'"
            no-spinner
            class="q-my-sm"
            style="
              cursor: pointer;
              filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
                brightness(96%) contrast(81%);
            "
            @click="openLink('https://chavi.com.br', '_blank')"
          />
        </div>
      </div>
      </div>
  </footer>
  </q-layout>
</template>

<script>
import { Loading, Notify, } from "quasar";
export default {
  data() {
    return {
      mensagem: "",
      visita: [],
      convite: [],
      status: {},
      nome: "",
      codigo: "",
    };
  },
  async mounted() {
    let coworking = this.$route.query.entidade;
    if (coworking && coworking != ""){
      this.atualizarCoworkingNome(coworking);
    }   
  },
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },
    async atualizarCoworkingNome(nomeCoworking){
      if(this.$store.getters.getCoworkingNome){
        return
      }else{        
        let nome = nomeCoworking
        nome = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ")[0]
        this.$store.dispatch("setarDados", {
          key: "setCoworkingNome",
          value: nome,
        });          
      }
    },

    catalogoMensagens(param) {
      let catalogo = {
        approved: "foi aprovado",
        in_process: "ainda está com o pagamento pendente",
      };

      return catalogo[param] || "";
    },

    aceitarMensagem(){
      this.$router.push("/home");  
    }
  },
};
</script>

<style>
a {
  text-decoration: none;
}

a:hover {
  filter: brightness(1.2);
}
.text {
  color: var(--q-primary);
}

.container {
  display: flex;
  justify-content: center;
  margin: 0;
}

h1 {
  font-size: 1.2rem;
  line-height: 2;
  font-weight: 600;
}

.box,
.box-text {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 2rem;
  letter-spacing: normal;
  font-family: "poppins";
  font-style: bold;
}

.box {
  width: 300px;
}

@media (max-width: 600px) {
  .box-text {
    text-align: center;
  }
}

@media (min-width: 600px) {
  h1,
  p,
  span {
    width: 100%;
    line-height: 3;
  }

  .box > div > p {
    line-height: 15px;
  }
}
</style>
