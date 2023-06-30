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
      entidadeId: "",
    };
  },
  async mounted() {
    let coworking = this.$route.query.entidade;
   
    if (coworking && coworking != ""){
     
      this.atualizarPreviaCoworking(coworking);     
    } 
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
 
        this.getImovel( this.visita.imovelId)
      }
      else{
        Notify.create({
            message:
              "Ocorreu um erro ao procurar convite!",
          });
      }
    } else {
      let rota = "/login?entidade="+coworking+"&redirect_to=pagamento_agendamento&redirect_param="+idConvite;
      if (coworking && coworking != ""){
            
        this.$router.push(rota);   
      } 
      else{
        this.$router.push("/login?redirect_to=pagamento_agendamento&redirect_param="+idConvite);
      }
    
    }

    //http://localhost:8080/feedbackAprovacao?convite_id=63e65653ffd6bb0365bb44c6  

  },
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },
    async atualizarPreviaCoworking(nomeCoworking){
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
    async atualizarCoworkingNome(){
      if(this.$store.getters.getCoworkingNome){
        return
      }else{
        let nome
        const response = await this.executeMethod({
            url: "Visitas/horariosOcupados",
            method: "GET",
            params: {
              clienteId: this.entidadeId,
              imovelRef: this.nomeImovel,
            },
          });
          if(response && response.status == 200){
            nome = response.data.entidade.nome
            nome = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ")[0]
            this.$store.dispatch("setarDados", {
              key: "setCoworkingNome",
              value: nome,
            });
          }
      }
    },
    async getPropriedadesEntidade(idEntidade){    
  
      let response = await this.executeMethod({
        url: 'Entidades/' + idEntidade,
        method: 'get',
      })
        
      if (response && response.status == 200) {
        return response.data;
      }
      else{
        return null
      }
    },
    async getImovel(idImovel){    
  
      let response = await this.executeMethod({
				url: 'Imoveis/obtem/' + idImovel,
				method: 'get',
			})
         
      if (response && response.status == 200) {
        this.nomeImovel = response.data.nome;

        let entidadeImovel = await this.getPropriedadesEntidade(response.data.entidadeId);
      
        if (entidadeImovel && entidadeImovel != null)
        {
          if ( response.data.opcoesAgendamentoIndividual.custaCreditos && entidadeImovel.opcoesCalendario.cobrarCreditoExtra && entidadeImovel.opcoesCalendario.chaveAgendamento != "")
              {
                entidadeImovel.opcoesCalendario.chaveAgendamento
                ? (this.chaveAgendamento =
                  entidadeImovel.opcoesCalendario.chaveAgendamento)
                : (this.chaveAgendamento = "");
              }
              else{
                response.data.opcoesAgendamentoIndividual.chaveAgendamento
                ? (this.chaveAgendamento =
                    response.data.opcoesAgendamentoIndividual.chaveAgendamento)
                : (this.chaveAgendamento = "");
              }
        }

       // this.chaveAgendamento = response.data.opcoesAgendamentoIndividual.chaveAgendamento;
        this.valorDaSala = response.data.opcoesAgendamentoIndividual.valorDaSala;

        if (this.chaveAgendamento != "")
        {
          this.liberarPagamento = true;
        }
        else{
          Notify.create({
            message:
              "Ocorreu um erro ao obter as configuraçõe de pagamento!",
        });
        }
        
        this.entidadeId = response.data.entidadeId;
        this.atualizarCoworkingNome()
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

      let data;
      if (this.convite.convitePagamento && this.convite.convitePagamento != {}){
        data = {
          id: this.convite.id,
          sala: this.nomeImovel,//this.visita.imovelRef,
          tempoDeUso: this.diferencaEmMinutos(
            this.visita.validadeInicial,
            this.visita.validadeFinal
          ),
          preco: this.convite.convitePagamento.custoFaltante,          
          imovel: this.visita.imovelId
        };
      }
      else{
        data = {
          id: this.convite.id,
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
      }      

      let request = {
        url: "Entidades/checkoutPagamento",
        method: "post",
        data: data,
      };

      const response = await this.executeMethod(request, false);
      
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

      let validadeInicial = parseInt(inicial)
      let validadeFinal = parseInt(final)

      const dataInicio = moment(validadeInicial);
      const dataFim = moment(validadeFinal);

      const calcula = dataFim.diff(dataInicio, "minutes");

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
