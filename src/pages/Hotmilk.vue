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
        <div class="full-width text-center text-black text-h5 q-mt-lg">
          <span
            >Agendamento para sala de reunião. Para realizá-lo, selecione a sala
            desejada abaixo:</span
          >
        </div>
        <div
          class="full-width flex flex-center q-gutter-x-lg"
          style="margin-top: 100px"
          v-for="(bloco, index) in blocos"
          :key="index"
        >
          <div
            v-for="(andar, index2) in bloco.andares"
            :key="index2"
            class="
              full-width
              row
              flex-center
              q-gutter-x-md q-mb-md
              bg-grey-3
              q-py-md
            "
            style="border-radius: 20px"
          >
            <div class="full-width text-center q-mb-xl">
              <span class="text-black text-h5"
                >Bloco {{ bloco.num }} Andar {{ andar.num }}</span
              >
            </div>
            <div
              class="q-gutter-y-sm"
              v-for="(sala, index3) in andar.salas"
              :key="index3"
            >
              <div
                class="
                  text-center
                  column
                  shadow-1
                  q-gutter-y-lg q-py-xs q-pb-xl
                  bg-white
                "
                style="border-radius: 20px; width: 300px; margin-bottom: 50px"
              >
                <div class="text-center q-px-lg" style="max-width: 300px">
                  <q-btn
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
      blocos: [
        {
          num: 1,
          andares: [
            {
              num: 1,
              salas: [
                {
                  ref: "Sala de Reunião 01",
                  link: "/5ee6bd904639f5bb55915447/Sala de Reunião 01",
                  foto: "sala_reuniao_01_b1a1.png",
                },
                {
                  ref: "Mini Sala 01",
                  link: "/5ee6bd904639f5bb55915447/Mini Sala 01",
                  foto: "mini_sala_01_b1a1.png",
                },
                {
                  ref: "Mini Sala 02",
                  link: "/5ee6bd904639f5bb55915447/Mini Sala 02",
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
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    open(url, target) {
      window.open(url, target);
    },
  },
};
</script>

<style></style>
