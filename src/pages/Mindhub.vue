<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <q-page padding>
        <!-- SELEÇÃO DO BLOCO -->
        <div
          v-if="selecionarBloco && imoveis && imoveis.length > 0"
          class="full-width text-h5 text-center"
          style="margin-top: 100px"
        >
          <div>
            <span>Em qual bloco você está?</span>
          </div>
          <div class="flex justify-around q-mt-md">
            <div
              v-for="(bloco, index) in blocos"
              :key="index"
              class="q-my-sm column flex content-center"
              style="width: 48%"
            >
              <q-btn
                push
                rounded
                color="teal"
                class="text-bold q-mb-md"
                style="max-width: 300px; width: 100%"
                :label="'Bloco ' + bloco.nome"
                @click="
                  escolherBloco(bloco)
                "
              />
              <q-img
                :src="bloco.foto"
                fit="contain"
                style="max-width: 300px; max-height: "
              />
            </div>
          </div>
        </div>
        <!-- SELEÇÃO DO IMÓVEL -->
        <div
          v-else
          class="full-width column flex-center"
          style="margin-top: 100px"
        >
          <div class="full-width text-center text-primary text-bold q-mb-md">
            <div class="q-mb-md" v-if="andarSelecionado">
              <q-btn
                style="font-size: 0.8rem; background-color: #0070a0"
                class="q-px-md"
                dense
                rounded
                push
                text-color="white"
                label="Selecionar outro andar"
                @click="
                escolherAndar(undefined)
                "
              />
            </div>
          </div>
          <div
            v-if="true"
            class="full-width column shadow-3 text-center items-center"
          >
            <!-- Card de cada imóvel   -->
            <div
              class="full-width shadow-3 row q-my-md q-px-md bg-grey-3"
              style="
                border-radius: 20px;
                height: 180px;
                max-width: 900px;
                cursor: pointer;
              "
              v-for="(imovel, index) in imoveisFiltred"
              :key="index"
              @click="
                agendamento(imovel, this.andarSelecionado, this.blocoSelecionado);
                $router.push(imovel.link);
                "
            >
              <div class="col-4 row content-center justify-center">
                <q-img
                  :src="getImage(imovel.foto)"
                  fit="contain"
                  height="150px"
                  width="180px"
                  spinner-color="teal"
                />
              </div>
              <div class="col-8 column items-center justify-around">
                <span style="font-size: 1.2rem; color: teal"
                  >{{ imovel.nome }}
                </span>
                <div style="font-size: 0.9rem">
                  <span
                    v-if="
                      imovel.opcoesAgendamentoIndividual &&
                      imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas &&
                      imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas > 0
                    "
                    class="text-bold"
                  >
                    Limite de pessoas:
                    {{ imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas }}
                  </span>
                  <br />
                  <span>{{ imovel.endereco }}</span>
                  <span class="text-bold"> - {{ imovel.complemento }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
    <q-footer v-model="footer" reveal elevated>
      <div class="full-width text-center justify-center" style="height: 30px">
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
export default {
  data() {
    return {
      selecionarBloco: true,
      selecionarAndar: true,
      andarSelecionado: undefined,
      blocoSelecionado: undefined,
      blocos: [
      {
          foto: "https://media.gazetadopovo.com.br/2022/09/06141736/mindhub-capa-960x540.jpg",
          nome: "FAE Business School",
          andares: {},
        },
      ],
      imoveis: [],
    };
  },
  created() {
    this.carregarImoveis();
  },
  mounted() {
    let coworkingSecao = this.$store.getters.getCoworkingNome;
    if(coworkingSecao && coworkingSecao != "mindhub"){
        this.$store.dispatch("setarDados", {
        key: "setCoworkingNome",
        value: "mindhub",
      });    
    }else{
      this.andarSelecionado = this.$store.getters.getAndarSelecionado
    this.blocoSelecionado = this.$store.getters.getBlocoSelecionado
    if(this.blocoSelecionado == undefined){
      this.andarSelecionado = undefined;
      this.selecionarBloco = true;
      this.selecionarAndar = true;
    }else if(this.andarSelecionado == undefined){
      this.selecionarBloco = false;
      this.selecionarAndar = true;
    }else{
      this.selecionarBloco = false;
      this.selecionarAndar = false;
    }      
    }
  },
  computed: {
    imoveisFiltred() {
      const imoveis = this.imoveis;

      return imoveis
    },
  },
  methods: {
    escolherBloco(bloco){
      if(bloco == undefined){
        this.selecionarBloco = true;  
      }else{
        this.selecionarBloco = false;
      }
      this.selecionarAndar = true;
      this.blocoSelecionado = bloco;
    },
    escolherAndar(andar){

      if(andar == undefined){
        this.selecionarAndar = true;
      }else{
        this.selecionarAndar = false;
      }

      this.andarSelecionado = andar;
    },
    openLink(url, target) {
      window.open(url, target);
    },
    getImage(image) {
      if (image && image.indexOf("https://") > -1) return image;
      else if (image)
        return `${process.env.VUE_APP_API_URL}/StorageContainers/fotoImovel/download/${image}`;
      else return "default_room.png";
    },
    async carregarImoveis() {
      const response = await this.executeMethod({
        url: "Imoveis/retornarImoveisAgendamento",
        method: "get",
        params: {
          entidadeId: "642da32cb5e1fd78ec65767e",
        },
      });
      if (response.status == 200) {
        const imoveis = response.data;

        for (const imovel of imoveis) {
          imovel.link = `/${imovel.entidadeId}/${imovel.nome}`;
        }
        this.imoveis = imoveis;
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 450px) {
  .home-icon {
    display: none;
  }
}

.header-logo {
  display: flex;
  align-items: center;
}
.bar {
  height: 40px;
  width: 2px;
  margin: 5px;
  background-color: #505050;
}

.home-icon {
  position: absolute;
  transform: scale(1.6);
  z-index: 9999999;
  left: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
}
.header:hover {
  cursor: pointer;
}

.mindhub-logo {
  cursor: pointer;
  padding: 0 5px 0 5px;
}
</style>
