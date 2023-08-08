<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <q-page padding>
        <!-- SELEÇÃO DO BLOCO -->
        <div
          v-if="selecionarBloco && imoveis && imoveis.length > 0"
          class="full-width text-h5 text-center"
          style="margin-top: 10px"
        >
          <div>
            <span class="texto-bloco"
              >Em qual bloco <strong>você está</strong>?</span
            >
          </div>
          <div class="flex justify-around q-mt-md bloco-escolha">
            <div
              v-for="(bloco, index) in blocos"
              :key="index"
              class="q-my-sm column flex content-center box-images"
              style="width: 48%; "
            >
              <q-img
                :src="bloco.foto"
                fit="contain"
                style="
                  max-width: 300px;
                  border-radius: 16px;
                  margin-bottom: 15px;
                "
              />

              <q-btn
                push
                rounded
                class="q-mb-md purple-button"
                style=" border-radius: 40px; max-width: 80%; font-weight: bolder; min-width: fit-content;"
                :label="'Bloco ' + bloco.num"
                @click="
                  escolherBloco(bloco)
                "
              />
            </div>
          </div>
        </div>
        <!-- SELEÇÃO DO IMÓVEL -->
        <div v-else class="full-width column flex-center no-wrap">
          <div class="flex buttons-mobile justify-center q-mt-lg q-mb-lg">
            <div class="q-mb-md">
              <q-btn
                style=" background-color: #0070a0; z-index: 5;"
                class="red-button igual-black-negrito"
                dense
                rounded
                push
                text-color="white"
                label="Selecionar outro bloco"
                @click="
                  escolherBloco(undefined)
                "
              />
            </div>
            <div class="q-mb-md" v-if="andarSelecionado">
              <q-btn
                style=" background-color: #0070a0; z-index: 5"
                class="red-button igual-black-negrito"
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
          <style-bloco class="igual-black-negrito" v-bind:blocoSelecionado="blocoSelecionado" />
          <div v-if="blocoSelecionado && !selecionarAndar"
          class="igual-black-negrito q-mt-md"
          style="color: rgb(150, 84, 255); font-size: 1.47rem;"
          >{{ this.andarSelecionado === 'Térreo' ? 'TÉRREO' : `${this.andarSelecionado}° ANDAR `}}</div>
          <div
            v-if="blocoSelecionado && selecionarAndar"
            class="justify-center text-center q-gutter-y-md"
            style="margin-top: 20px"
          >
            <span style="font-size: 1.33rem; color: #505050;" class="texto-bloco"
              >Selecione <strong>um andar</strong></span
            >
            <div class="container-andares" >
              <div v-for="andar in blocoSelecionado.andares" :key="andar">
                <q-btn
                  push
                  rounded
                  dense
                  class="purple-button q-pr-xl q-pl-xl igual-black-negrito "
                  :label="`${andar === 'Térreo' ? andar : andar + '° Andar '}`"
                  style="width: 100%; max-width: 200px "
                  @click="
                    escolherAndar(andar)
                  "
                />
              </div>
            </div>
          </div>
          <div
            v-if="blocoSelecionado && !selecionarAndar"
            class="full-width column text-center items-center"
            style="margin-top: 10px;"
          >
            <!-- Card de cada imóvel   -->
            <div
              class="full-width shadow-3 row q-my-md q-px-md gradient-hotmilk"
              style="
                border-radius: 20px;
                min-height: 180px;
                max-width: 500px;
                cursor: pointer;
              "
              v-for="(imovel, index) in imoveisFiltred"
              :key="index"
              @click="
                agendamento(imovel);
                $router.push(imovel.link);
              "
            >
              <div class="col-4 row content-center justify-center">
                <q-img
                  :src="getImage(imovel.foto)"
                  style="border-radius: 20px; height: 150px; max-width: 100px"
                  spinner-color="primary"
                />
              </div>
              <div
                class="col-7 column justify-evenly"
                style="padding-left: 15px; text-align: left"
              >
                <span
                  class="igual-black-negrito"
                  style="
                    font-size: 1.2rem;
                    color: #505050;
                  "
                  >{{ imovel.nome.toUpperCase().split("-")[0] }}
                </span>
                <div
                  style="
                    font-size: 0.9rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    font-family: 'igualfina';
                    color: #505050;
                  "
                >
                  <span
                    v-if="
                      imovel.opcoesAgendamentoIndividual &&
                      imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas &&
                      imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas > 0
                    "
                  >
                    Limite de pessoas:
                    <strong style="font-family: 'igual';">{{
                      imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas
                        .length == 1
                        ? `0${imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas}`
                        : imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas
                    }}</strong>
                  </span>
                  <br />
                  <span style="max-width: 250px; color: #505050;">{{ imovel.endereco }}.</span>
                  <span style="font-family: 'igual'; font-weight: bold;">{{ imovel.complemento }}</span>
                </div>
              </div>
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
import StyleBloco from "src/components/styleBloco.vue";

export default {
  components: {
    "style-bloco": StyleBloco,
  },
  data() {
    return {
      selecionarBloco: true,
      selecionarAndar: true,
      andarSelecionado: undefined,
      blocoSelecionado: undefined,
      blocos: [
        {
          foto: "bloco_1.png",
          num: 1,
          andares: {},
        },
        {
          foto: "bloco_2.png",
          num: 2,
          andares: {},
        },
      ],
      imoveis: [],
    };
  },
  created() {
    this.carregarImoveis();
    this.voltarOndeEstava();
  },
  computed: {
    imoveisFiltred() {
      const imoveis = this.imoveis.filter((item) => {
        const andar =
          item.andar != undefined && item.andar == 0 ? "Térreo" : item.andar;

        return (
          this.blocoSelecionado &&
          this.andarSelecionado &&
          item.bloco &&
          andar &&
          item.bloco == this.blocoSelecionado.num &&
          andar == this.andarSelecionado
        );
      });
      imoveis.sort((a, b) => {
        return a.nome < b.nome ? -1 : 1;
      });
      return imoveis;
    },
    login: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getLogin));
      },
    },
  },
  mounted() {
    let coworkingSecao = this.$store.getters.getCoworkingNome;
    if(coworkingSecao && coworkingSecao != "hotmilk"){
        this.$store.dispatch("setarDados", {
        key: "setCoworkingNome",
        value: "hotmilk",
      });          
    }
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
    voltarOndeEstava() {
   
      this.selecionarBloco = true;
      this.selecionarAndar = true;
      this.andarSelecionado = undefined;
      this.blocoSelecionado = undefined;
    
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
          entidadeId: "5ee6bd904639f5bb55915447",
        },
      });
      if (response.status == 200) {
        const imoveis = response.data;
        for (const imovel of imoveis) {
          const complemento = imovel.complemento
            ? imovel.complemento.split(" - ")
            : undefined;
          if (complemento) {
            let bloco = complemento[0];
            let andar = complemento[1];
            if (bloco) {
              bloco = parseInt(bloco.replace(/\D/g, ""));
              imovel.bloco = bloco;
            }
            if (andar) {
              andar = /(Térreo)+/gi.test(andar)
                ? 0
                : parseInt(andar.replace(/\D/g, ""));
              const label = andar == 0 ? "Térreo" : andar;
              imovel.andar = andar;
              const index = this.blocos.findIndex((b) => b.num == bloco);
              if (index > -1 && !this.blocos[index].andares[andar])
                this.blocos[index].andares[andar] = label;
            }
          } else console.log("Verificar complemento - ", imovel.nome);
          imovel.link = `/${imovel.entidadeId}/${imovel.nome}`;
        }
        this.imoveis = imoveis;
      }
    },
    agendamento(imovel) {
      this.$store.dispatch("setarDados", {
        key: "setImovelAgendamento",
        value: imovel,
      });
      this.$store.dispatch("setarDados", {
        key: "setAndarSelecionado",
        value: this.andarSelecionado,
      });
      this.$store.dispatch("setarDados", {
        key: "setBlocoSelecionado",
        value: this.blocoSelecionado,
      });
      return;
    },
  },
};
</script>

<style scoped>
.texto-bloco {
  font-family: 'igualfina';
  color: #505050;
}

.purple-button {
  white-space: nowrap;
}

@media (max-width: 620px) {
  .bloco-escolha {
    flex-direction: column;
    align-items: center;
  }
}
.box-images {
  align-items: center;
}
@media (max-width: 620px) {
    .container-andares {
    flex-direction: column;
  }
}
.container-andares {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

@media (max-width: 450px) {
  .home-icon {
    display: none;
  }
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
  align-items: center;
}
.bar {
  height: 40px;
  width: 2px;
  margin: 5px;
  background-color: #505050;
}

@media (min-width: 500px) {
  .buttons-mobile {
    gap: 30px;
    flex-direction: row;
  }
}
@font-face {
  font-family: 'igualnegrito';
  src: url('../../public/fonts/Igual/Igual-Black.otf') format('truetype');
  font-weight: 900;
  font-style: normal;
}

.igual-black-negrito {
  font-family: 'igualnegrito';
  font-weight: bold;
}
@font-face {
  font-family: 'igualfina';
  src: url('../../public/fonts/Igual/Igual-Regular.otf') format('truetype');
  font-style: normal;
}

</style>
