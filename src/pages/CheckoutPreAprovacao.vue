<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <!-- <q-img
          src="agora_logo.png"
          fit="contain"
          width="100px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
        /> -->
        <q-img
          src="chavi_marca.png"
          fit="contain"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          style="
            filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
              brightness(96%) contrast(81%);
          "
          class="q-my-sm"
        />
      </q-toolbar>
    </q-header>

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
                <h1>Olá, {{ nome }}.</h1>
                <div
                  style="width: 300px; padding-left: 8px; padding-right: 8px"
                >
                  <p>Para o agendamento da sala {{ mensagem }}.</p>

                  <p>
                    Atenciosamente,
                    <br />
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
export default {
  data() {
    return {   
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
      // let response = await this.executeMethod({
			// 	url: 'Convites/obtem/' + idConvite,
			// 	method: 'get',
			// })
      let response = await this.executeMethod({
				url: 'Convites/' + idConvite,
				method: 'get',
			})

      if (response && response.status == 200) {
        this.convite = response.data;
        this.visita = response.data.dadosVisita;
       // this.imovelId = visita.imovelId;
        this.getImovel( this.visita.imovelId)
   
        console.log("🚀 ~ file: CheckoutPreAprovacao.vue:135 ~ mounted ~ response:", response)       
      }
      else{
        console.log("🚀 ~ file: CheckoutPreAprovacao.vue:135 ~ mounted ~ response:", response) 
      }
    } else {
      this.$router.push("/login?redirect_to=pagamento_agendamento&redirect_param="+idConvite);
    }
    console.log("Ddddddddddddddddd")
    //http://localhost:8080/feedbackAprovacao?convite_id=63e65653ffd6bb0365bb44c6
  
    //let idImovel = this.catalogoMensagens(this.$route.query.imovel_id);




    // const response = await this.executeMethod({
    //         url: "Visitas/horariosOcupados",
    //         method: "GET",
    //         params: {
    //           clienteId: cliente,
    //           imovelRef: imovel,
    //         },
    // });

    // if (response && response.status == 200) {

    // }
     

    // this.mensagem = this.catalogoMensagens(this.$route.query.collection_status);
    // this.visita = this.$store.getters.getConvite;
    // this.nome = this.visita.name.charAt(0).toUpperCase() + this.visita.name.slice(1);

    // if (this.$route.query.collection_status === "approved") {

    //   let request = {
    //     url: "Visitas/validarVisita",
    //     method: "post",
    //     data: {
    //       ...this.visita,
    //       pagamentoAutorizado: true,
    //     },
    //   };
    //   const response = await this.executeMethod(request, false);
    //   this.codigo = response.data.codigo;
    // }
  },
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },

    async getImovel(idImovel){    
  
      let response = await this.executeMethod({
				url: 'Imoveis/' + idImovel,
				method: 'get',
			})
         
      if (response && response.status == 200) {
        this.nomeImovel = response.data.nome;
        this.chaveAgendamento = response.data.opcoesAgendamentoIndividual.chaveAgendamento;
        this.valorDaSala = response.data.opcoesAgendamentoIndividual.valorDaSala;
        console.log("🚀 ~ file: CheckoutPreAprovacao.vue:135 ~ mounted ~ response:", response)  
        //await this.checkoutPagamento()        
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

      // let convite = {
      //     id : "",
      //     name: "string",
      //     empresa: "string",
      //     phone: "string",
      //     cpf: "string",
      //     email: "string",
      //     terms: true,
      //     use: true,
      //     hasDocs: true,
      // }
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

    // catalogoMensagens(param) {
    //   let catalogo = {
    //     approved: "foi aprovado",
    //     in_process: "ainda está com o pagamento pendente",
    //   };

    //   return catalogo[param] || "";
    // },
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
