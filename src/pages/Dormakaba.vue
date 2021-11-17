<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-img
          src="dormakaba.png"
          fit="contain"
          width="100px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
        />
        <q-img
          style="cursor: pointer"
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
          @click="open('https://chavi.com.br/', '_blank')"
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
        <div class="full-width flex flex-center" style="margin-top: 100px">
          <div
            class="
              text-center
              column
              q-gutter-lg
              shadow-1
              full-width
              q-py-xs q-pb-xl
            "
            style="border-radius: 20px"
          >
            <span class="text-black text-h5">Bloco 1 Andar 1</span>
            <div>
              <q-btn
                class="q-pa-sm text-bold"
                color="primary"
                text-color="white"
                label="Sala de Reunião - Bloco 1 - 1º andar"
                @click="
                  $router.push('/618ec1c37ec86fa253e9d3ab/Sala de Reunião 01')
                "
              />
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
  methods: {
    open(url, target) {
      window.open(url, target);
    },
  },
};
</script>

<style></style>
