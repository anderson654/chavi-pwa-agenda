<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-btn
          style="font-size: 0.7rem"
          icon="home"
          flat
          dense
          color="secondary"
          class="home-icon"
          @click="
            selecionarBloco = true;
            blocoSelecionado = null;
          "
        />
        <div class="header" @click="$router.push('/')">
          <q-img
            src="hotmilk.png"
            fit="contain"
            width="150px"
            :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
            style="
              filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
                brightness(96%) contrast(81%);
            "
            no-spinner
            class="q-my-sm"
          />
          <div class="bar"></div>
          <q-img
            src="chavi_marca.png"
            fit="contain"
            width="150px"
            :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
            no-spinner
            class="q-my-sm"
            style="
              filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
                brightness(96%) contrast(81%);
            "
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <!-- SELEÇÃO DO BLOCO -->
        <div
          v-if="selecionarBloco && imoveis && imoveis.length > 0"
          class="full-width text-h5 text-center"
          style="margin-top: 100px"
        >
          <div>
            <span class="texto-bloco"
              >Em qual bloco <strong>você está?</strong></span
            >
          </div>
          <div class="flex justify-around q-mt-md">
            <div
              v-for="(bloco, index) in blocos"
              :key="index"
              class="q-my-sm column flex content-center box-images"
              style="width: 48%"
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
                class="text-bold q-mb-md purple-button"
                :label="'Bloco ' + bloco.num"
                @click="
                  selecionarBloco = false;
                  blocoSelecionado = bloco;
                "
              />
            </div>
          </div>
        </div>
        <!-- SELEÇÃO DO IMÓVEL -->
        <div v-else class="full-width column flex-center no-wrap">
          <div class="flex buttons-mobile justify-center">
            <div class="q-mb-md">
              <q-btn
                style="font-size: 0.8rem; background-color: #0070a0; z-index: 5"
                class="red-button"
                dense
                rounded
                push
                text-color="white"
                label="Selecionar outro bloco"
                @click="
                  selecionarBloco = true;
                  blocoSelecionado = undefined;
                "
              />
            </div>
            <div class="q-mb-md" v-if="andarSelecionado">
              <q-btn
                style="font-size: 0.8rem; background-color: #0070a0; z-index: 5"
                class="red-button"
                dense
                rounded
                push
                text-color="white"
                label="Selecionar outro andar"
                @click="
                  selecionarAndar = true;
                  andarSelecionado = undefined;
                "
              />
            </div>
          </div>
          <style-bloco v-bind:blocoSelecionado="blocoSelecionado" />
          <div
            v-if="blocoSelecionado && selecionarAndar"
            class="justify-center text-center q-gutter-y-md"
            style="margin-top: 20px"
          >
            <span style="font-size: 1rem; color: #505050"
              >Selecione <strong>um andar</strong></span
            >
            <div class="container-andares">
              <div v-for="andar in blocoSelecionado.andares" :key="andar">
                <q-btn
                  push
                  rounded
                  dense
                  class="purple-button"
                  :label="`${andar === 'Térreo' ? andar : 'Andar ' + andar}`"
                  style="width: 100%; max-width: 200px"
                  @click="
                    andarSelecionado = andar;
                    selecionarAndar = false;
                  "
                />
              </div>
            </div>
          </div>
          <div
            v-if="blocoSelecionado && !selecionarAndar"
            class="full-width column shadow-3 text-center items-center"
            style="margin-top: 30px"
          >
            <!-- Card de cada imóvel   -->
            <div
              class="full-width shadow-3 row q-my-md q-px-md gradient-hotmilk"
              style="
                border-radius: 20px;
                height: 180px;
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
                  style="border-radius: 20px; height: 150px; max-width: 150px"
                  spinner-color="primary"
                />
              </div>
              <div
                class="col-7 column justify-around"
                style="padding-left: 15px; text-align: left"
              >
                <span
                  style="
                    font-size: 1.2rem;
                    color: #505050;
                    font-weight: 800;
                    white-space: nowrap;
                    min-width: 270px;
                  "
                  >{{ imovel.nome.toUpperCase().split("-")[0] }}
                </span>
                <div
                  style="
                    font-size: 0.9rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
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
                    <strong>{{
                      imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas
                        .length == 1
                        ? `0${imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas}`
                        : imovel.opcoesAgendamentoIndividual.numeroMaximoPessoas
                    }}</strong>
                  </span>
                  <br />
                  <span style="max-width: 80px">{{ imovel.endereco }}.</span>
                  <span class="text-bold">{{ imovel.complemento }}</span>
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
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          color: white;
          text-align: center;
          background-color: rgba(240, 240, 240, 0.9);
        "
      >
        <span
          @click="openLink('https://chavi.com.br', '_blank')"
          style="cursor: pointer; font-size: 1.2rem; color: #505050"
        >
          Visite
          <span style="text-decoration: underline">nosso site</span>
        </span>
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
      console.log("TAPIOCA imoveis filtred", imoveis)
      return imoveis;      
    },

  },
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },
    voltarOndeEstava() {
      if (this.$store.getters.getEstadoInicial) {
        this.selecionarBloco = false;
        this.selecionarAndar = false;
        this.andarSelecionado = "Térreo";
        this.blocoSelecionado = {
          andares: { 0: "Térreo", 1: 1, 2: 2 },
          foto: "bloco_1.png",
          num: 1,
        };
      } else {
        this.selecionarBloco = true;
        this.selecionarAndar = true;
        this.andarSelecionado = undefined;
        this.blocoSelecionado = undefined;
      }
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
    agendamento(imovel){
      this.$store.dispatch("setarDados",{key:"setImovelAgendamento", value:imovel});
      console.log("TAPIOCA agendamento",this.imoveis);
      return
    },
  },
};
</script>

<style scoped>
.texto-bloco {
  color: #505050;
}

.box-images {
  align-items: center;
}

.container-andares {
  display: flex;
  flex-direction: row;
  gap: 20px;
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
.header:hover {
  cursor: pointer;
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
</style>
