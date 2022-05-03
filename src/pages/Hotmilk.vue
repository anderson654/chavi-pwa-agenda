<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-img
          src="hotmilk.png"
          fit="contain"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
        />
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
          class="q-my-sm"
        />
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
            <span>Em qual bloco você esta?</span>
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
                color="primary"
                class="text-bold q-mb-md"
                style="max-width: 300px; width: 100%"
                :label="'Bloco ' + bloco.num"
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
            <div class="q-mb-md">
              <q-btn
                style="font-size: 0.8rem; background-color: #0070a0"
                class="q-px-md"
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
            <span class="text-h4 text-bold">
              Bloco {{ blocoSelecionado ? blocoSelecionado.num : 0 }}
            </span>
          </div>
          <div
            v-if="blocoSelecionado && selecionarAndar"
            class="column justify-center text-center q-gutter-y-md"
          >
            <span style="font-size: 1rem">Selecione um andar</span>
            <div v-for="andar in blocoSelecionado.andares" :key="andar">
              <q-btn
                push
                rounded
                dense
                color="primary"
                :label="`Andar ${andar}`"
                style="width: 100%; max-width: 200px"
                @click="
                  andarSelecionado = andar;
                  selecionarAndar = false;
                "
              />
            </div>
          </div>
          <div
            v-if="blocoSelecionado && !selecionarAndar"
            class="full-width column shadow-3 text-center items-center"
          >
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
                  spinner-color="primary"
                />
              </div>
              <div class="col-8 column items-center justify-around">
                <span style="font-size: 1.2rem" class="text-primary">{{
                  imovel.nome
                }}</span>
                <div style="font-size: 0.9rem">
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
      <div
        class="full-width bg-grey-2 text-center justify-center"
        style="height: 60px"
      >
        <div>
          <span
            @click="openLink('https://chavi.com.br', '_blank')"
            class="text-black text-h6"
            style="cursor: pointer; text-decoration: underline"
          >
            Visite nosso site
          </span>
        </div>
      </div>
      <div class="full-width bg-grey-8" style="height: 15px" />
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
  },
  computed: {
    imoveisFiltred() {
      const imoveis = this.imoveis.filter((item) => {
        return (
          this.blocoSelecionado &&
          this.andarSelecionado &&
          item.bloco &&
          item.andar &&
          item.bloco == this.blocoSelecionado.num &&
          item.andar == this.andarSelecionado
        );
      });
      imoveis.sort((a, b) => {
        return a.andar - b.andar;
      });
      return imoveis;
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
                ? "Térreo"
                : parseInt(andar.replace(/\D/g, ""));
              imovel.andar = andar;
              const index = this.blocos.findIndex((b) => b.num == bloco);
              if (index > -1 && !this.blocos[index].andares[andar])
                this.blocos[index].andares[andar] = andar;
            }
          } else console.log("Verificar complemento - ", imovel.nome);
          imovel.link = `/${imovel.entidadeId}/${imovel.nome}`;
        }
        this.imoveis = imoveis;
      }
    },
  },
};
</script>

<style></style>
