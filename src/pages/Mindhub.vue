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

        <div class="header-logo" @click="$router.push('/')">
          <q-img
            src="logo aplicação.png"
            fit="contain"
            width="100px"
            :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
            no-spinner
            class="q-my-sm mindhub-logo"
          />
          <div class="bar"></div>
          <q-img
            src="chavi_marca.png"
            fit="contain"
            width="150px"
            :style="$q.platform.is.desktop ? 'width: 150px' : 'width: 130px'"
            no-spinner
            style="
              filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
                brightness(96%) contrast(81%);
            "
            class="q-my-sm"
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
                  selecionarBloco = false;
                  blocoSelecionado = bloco;
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
                  selecionarAndar = true;
                  andarSelecionado = undefined;
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
              @click="$router.push(imovel.link)"
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
  computed: {
    imoveisFiltred() {
      const imoveis = this.imoveis;

      return imoveis
    },
  },
  methods: {
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
          // const complemento = imovel.complemento
          //   ? imovel.complemento.split(" - ")
          //   : undefined;
          // if (complemento) {
          //   let bloco = complemento[0];
          //   console.log("bloco", bloco);
          //   let andar = complemento[1];
          //   console.log(bloco, "bloco");
          //   console.log(andar, "andar");
          //   if (bloco) {
          //     bloco = parseInt(bloco.replace(/\D/g, ""));
          //     imovel.bloco = bloco;
          //   }
          //   if (andar) {
          //     andar = /(Térreo)+/gi.test(andar)
          //       ? 0
          //       : parseInt(andar.replace(/\D/g, ""));
          //     const label = andar == 0 ? "Térreo" : andar;
          //     imovel.andar = andar;
          //     const index = this.blocos.findIndex((b) => b.nome == bloco);
          //     if (index > -1 && !this.blocos[index].andares[andar])
          //       this.blocos[index].andares[andar] = label;
          //   }
          // } else console.log("Verificar complemento - ", imovel.nome);
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
