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
      <q-page padding v-if="imoveis && imoveis.length == 0">
        <div class="full-width text-center text-black text-h5 q-mt-lg">
          <span
            >Agendamento para reuniões. Para realizá-lo, selecione a sala
            desejada.</span
          >
        </div>
        <div
          v-if="selecionarBloco"
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
                  blocoSelecionado = bloco.num;
                "
              />
              <q-img :src="bloco.foto" fit="contain" style="max-width: 300px" />
            </div>
          </div>
        </div>
        <div
          v-else-if="!selecionarBloco && blocoSelecionado > 0"
          class="full-width flex flex-center q-gutter-x-lg"
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
                  blocoSelecionado = 0;
                "
              />
            </div>
            <span class="text-h4 text-bold">Bloco {{ blocoSelecionado }}</span>
          </div>
          <div
            v-for="(andar, index2) in blocos[blocoSelecionado - 1].andares"
            :key="index2"
            class="full-width row flex-center q-gutter-x-md q-mb-md bg-grey-3 q-py-md"
            style="border-radius: 20px"
          >
            <div class="full-width text-center q-mb-xl">
              <span class="text-black text-h5 text-bold">
                Andar {{ andar.num }}</span
              >
            </div>
            <div
              class="q-gutter-y-sm"
              v-for="(sala, index3) in andar.salas"
              :key="index3"
            >
              <div
                class="text-center column shadow-1 q-gutter-y-lg q-py-xs q-pb-xl bg-white"
                style="border-radius: 20px; width: 300px; margin-bottom: 50px"
              >
                <div class="text-center q-px-lg" style="max-width: 300px">
                  <q-btn
                    rounded
                    push
                    class="text-bold"
                    color="primary"
                    text-color="white"
                    :label="sala.ref"
                    @click="$router.push(sala.link)"
                  />
                </div>
                <div>
                  <q-img
                    :src="sala.foto"
                    @click="$router.push(sala.link)"
                    spinner-color="white"
                    style="
                      height: 200px;
                      max-width: 250px;
                      object-fit: contain !important;
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
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
                  blocoSelecionado = bloco.num;
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
          class="full-width column flex-center q-gutter-x-lg"
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
                  blocoSelecionado = 0;
                "
              />
            </div>
            <span class="text-h4 text-bold">Bloco {{ blocoSelecionado }}</span>
          </div>
          <div
            class="full-width shadow-3 row q-my-md q-px-md bg-grey-3"
            style="border-radius: 20px; height: 180px; max-width: 900px"
            v-for="(imovel, index) in imoveisFiltred"
            :key="index"
            @click="$router.push(imovel.link)"
          >
            <div class="col-4">
              <q-img
                :src="getImage(imovel.foto)"
                contain
                spinner-color="primary"
                style="max-width: 180px; max-height: 180px"
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
      blocoSelecionado: 0,
      blocos: [
        {
          foto: "bloco_1.png",
          num: 1,
          andares: [
            {
              num: 1,
              salas: [
                {
                  ref: "Sala 01 Tarumã",
                  link: "/5ee6bd904639f5bb55915447/Sala 01 Tarumã",
                  foto: "sala_reuniao_01_b1a1.png",
                },
                {
                  ref: "Meeting Point 01",
                  link: "/5ee6bd904639f5bb55915447/Meeting Point 01",
                  foto: "mini_sala_01_b1a1.png",
                },
                {
                  ref: "Meeting Point 02",
                  link: "/5ee6bd904639f5bb55915447/Meeting Point 02",
                  foto: "mini_sala_02_b1a1.png",
                },
              ],
            },
            {
              num: 2,
              salas: [
                {
                  ref: "Auditório 01",
                  link: "/5ee6bd904639f5bb55915447/Auditório 01",
                  foto: "auditorio_b1a2.png",
                },
                {
                  ref: "Sala 01 Rebouças",
                  link: "/5ee6bd904639f5bb55915447/Sala 01 Rebouças",
                  foto: "sala_reuniao_01_b1a2.png",
                },
                {
                  ref: "Sala 02 Ópera de Arame",
                  link: "/5ee6bd904639f5bb55915447/Sala 02 Ópera de Arame",
                  foto: "sala_reuniao_02_b1a2.png",
                },
                {
                  ref: "Sala 03 Rua das Flores",
                  link: "/5ee6bd904639f5bb55915447/Sala 03 Rua das Flores",
                  foto: "sala_reuniao_03_b1a2.png",
                },
              ],
            },
          ],
        },
        {
          foto: "bloco_2.png",
          num: 2,
          andares: [
            {
              num: 3,
              salas: [
                {
                  ref: "Auditório Margareth Hamilton",
                  link: "/5ee6bd904639f5bb55915447/Auditório Margareth Hamilton",
                  foto: "auditorio_margareth_hamilton.png",
                },
                {
                  ref: "Aceleradora Hotmilk",
                  link: "/5ee6bd904639f5bb55915447/Aceleradora Hotmilk",
                  foto: "sala_hotmilk_aceleradora.png",
                },
                {
                  ref: "Lean Startup",
                  link: "/5ee6bd904639f5bb55915447/Lean Startup",
                  foto: "sala_lean_startup.png",
                },
              ],
            },
            {
              num: 4,
              salas: [
                {
                  ref: "Sala Henry Chesbrough",
                  link: "/5ee6bd904639f5bb55915447/Sala Henry Chesbrough",
                  foto: "sala_henry_chesbrough.png",
                },
              ],
            },
          ],
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
        return item.bloco && item.bloco == this.blocoSelecionado;
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
              andar = parseInt(andar.replace(/\D/g, ""));
              imovel.andar = andar;
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
