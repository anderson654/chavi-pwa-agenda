<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding>
        <div class="full-width text-center text-black text-h5 q-mt-lg"></div>
        <div class="full-width flex flex-center" style="margin-top: 4rem">
          <div
            class="text-center column q-gutter-lg shadow-1 full-width q-py-xs q-pb-xl"
            style="border-radius: 20px"
          >
            <span class="text-black text-h5"
              >Houve um problema com seu pagamento!</span
            >
            <div>
              <q-btn
                class="q-pa-sm text-bold"
                color="primary"
                text-color="white"
                label="Acesse o link da sua visita"
                @click="
                  $router.push('/618ec1c37ec86fa253e9d3ab/Sala de Reunião 01')
                "
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer reveal elevated>
      <div
        class="full-width bg-grey-2 text-center justify-center"
        style="height: 60px"
      >
        <div>
          <span
            @click="openLink('https://chavi.com.br/', '_blank')"
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
    openLink(url, target) {
      window.open(url, target);
    },
  },
};
</script>

<style></style>
