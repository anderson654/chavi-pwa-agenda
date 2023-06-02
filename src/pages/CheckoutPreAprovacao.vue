<template>
  <q-layout view="lHh Lpr lFf">
    

    <q-page-container style="padding-top: 10px">
      <q-page padding>
        <div class="container">
          <div class="box-text" style="padding-left: 8px; padding-right: 8px">
            <span
              >Sua solicitação de Agendamento! Foi pré-aprovada, e necessita do
              <span class="text">pagamento</span>.
            </span>
          </div>
        </div>

        <div class="full-width text-center text-black text-h5 q-mt-lg"></div>
        <div class="full-width flex flex-center" style="margin-top: 30px">
          <div
            class="text-center column q-gutter-lg shadow-1 full-width q-py-xs q-pb-xl"
            style="border-radius: 20px"
          >
            <div class="container">
              <div class="box">
                <div
                  style="width: 300px; padding-left: 8px; padding-right: 8px"
                >
                  <p>Para o agendamento da sala.</p>
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
                  :disable=!liberarPagamento
                  class="q-pa-sm text-bold"
                  color="primary"
                  text-color="white"
                  label="Realize o Pagamento"
                  @click=checkoutPagamento
                />
              </form>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer v-model="footer" reveal elevated>
      <div
        class="full-width text-center justify-center"
        style="height: 30px; background-color: white"
      >
        <div>
          <span
            @click="openLink('https://chavi.com.br', '_blank')"
            class="text-black text-h6"
            style="cursor: pointer"
          >
            Visite nosso site
          </span>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import * as moment from "moment";
import { Loading, Notify, } from "quasar";
export default {
  data() {
    return {   
      liberarPagamento : false,
      nomeImovel : "",
      chaveAgendamento : "",
      convite : {},
      visita : {},
      user : {},
      imovelId : "",
      validadeInicial : "",
      validadeFinal : "",
      valorDaSala : "",
    };
  },
  async mounted() {
    let idConvite = this.$route.query.convite_id;
    if (this.$store.getters.getLogin.user) {
      this.user = this.$store.getters.getLogin.user;
 
      let response = await this.executeMethod({
				url: 'Convites/obtem/' + idConvite,
				method: 'get',
			})

      if (response && response.status == 200) {
        this.convite = response.data;
        this.visita = response.data.dadosVisita;
        this.nomeImovel = response.data.nome;
 
        this.getImovel( this.visita.imovelId)
   
        console.log("🚀 ~ file: CheckoutPreAprovacao.vue:135 ~ mounted ~ response:", response)       
      }
      else{
        Notify.create({
            message:
              "Ocorreu um erro ao procurar convite!",
          });
      }
    } else {
      this.$router.push("/login?redirect_to=pagamento_agendamento&redirect_param="+idConvite);
    }

    //http://localhost:8080/feedbackAprovacao?convite_id=63e65653ffd6bb0365bb44c6  

  },
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },

    async getImovel(idImovel){    
  
      let response = await this.executeMethod({
				url: 'Imoveis/obtem/' + idImovel,
				method: 'get',
			})
         
      if (response && response.status == 200) {
        this.nomeImovel = response.data.nome;
        this.chaveAgendamento = response.data.opcoesAgendamentoIndividual.chaveAgendamento;
        this.valorDaSala = response.data.opcoesAgendamentoIndividual.valorDaSala;
        this.liberarPagamento = true;
        console.log("🚀 ~ file: CheckoutPreAprovacao.vue:135 ~ mounted ~ response:", response)  
        //await this.checkoutPagamento()        
      }
      else{
        Notify.create({
            message:
              "Ocorreu um erro ao procurar Equipamento!",
        });
      }
    },
    async getEntidade(){
    
    },
    async checkoutPagamento() {
      const data = {
        sala: this.nomeImovel,//this.visita.imovelRef,
        tempoDeUso: this.diferencaEmMinutos(
          this.visita.validadeInicial,
          this.visita.validadeFinal
        ),
        preco:
          this.valorDaSala *
          (this.diferencaEmMinutos(
            this.visita.validadeInicial,
            this.visita.validadeFinal
          ) /
            15),
        imovel: this.visita.imovelId
      };

      let request = {
        url: "Entidades/checkoutPagamento",
        method: "post",
        data: data,
      };

      const response = await this.executeMethod(request, false);
      console.log("🚀 ~ file: CheckoutPreAprovacao.vue:238 ~ checkoutPagamento ~ response:", response)

     
      this.$store.dispatch("setarDados", {
        key: "setConvite",
        value: this.convite,
      });
      
      const mp = new MercadoPago(this.chaveAgendamento, {
        locale: "pt-BR",
      });
      mp.checkout({
        preference: {
          id: response.data,
        },
        render: {
          container: ".cho-container",
          label: "Efetuar pagamento",
        },
        autoOpen: true,
      });
      
      return;
    },
    diferencaEmMinutos(inicial, final) {
      console.log("🚀 ~ file: CheckoutPreAprovacao.vue:270 ~ diferencaEmMinutos ~ final:", final)
      console.log("🚀 ~ file: CheckoutPreAprovacao.vue:270 ~ diferencaEmMinutos ~ inicial:", inicial)

      let validadeInicial = parseInt(inicial)
      let validadeFinal = parseInt(final)

      const dataInicio = moment(validadeInicial);
      console.log("🚀 ~ file: CheckoutPreAprovacao.vue:280 ~ diferencaEmMinutos ~ dataInicio:", dataInicio)
      const dataFim = moment(validadeFinal);
      console.log("🚀 ~ file: CheckoutPreAprovacao.vue:282 ~ diferencaEmMinutos ~ dataFim:", dataFim)

      const calcula = dataFim.diff(dataInicio, "minutes");
      console.log("🚀 ~ file: CheckoutPreAprovacao.vue:279 ~ diferencaEmMinutos ~ calcula:", calcula)

      return calcula;
    },


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
