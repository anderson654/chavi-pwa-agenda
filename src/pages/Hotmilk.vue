<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-img
          src="hotmilk.png"
          fit="contain"
          width="10vw"
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
          width="10vw"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
          @click="open('https://chavi.com.br', '_system')"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="full-width text-center text-black text-h4 q-mt-lg">
          <span>Faça seu agendamento aqui!</span>
        </div>
        <div class="full-width flex flex-center" style="margin-top: 100px">
          <div class="text-center column q-gutter-lg">
            <span class="text-black text-h5">Bloco 1 Andar 1</span>
            <div>
              <q-btn
                class="q-pa-sm text-bold"
                color="primary"
                text-color="white"
                label="Sala de Reunião"
                @click="$router.push('/5ee6bd904639f5bb55915447/Sala01')"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer v-model="footer" reveal elevated>
      <div
        class="full-width bg-grey-2 text-center justify-center"
        style="height: 100px"
      >
        <div>
          <span
            class="text-black text-h5"
            style="cursor: pointer; text-decoration: underline"
          >
            Visite nosso site
          </span>
        </div>
      </div>
      <div class="full-width bg-grey-8" style="height: 30px" />
    </q-footer>
  </q-layout>
</template>

<script>
export default {};
</script>

<style></style>
