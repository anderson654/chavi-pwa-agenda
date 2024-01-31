<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
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
          style="
            filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
              brightness(96%) contrast(81%);
          "
          class="q-my-sm"
        />
      </q-toolbar>
    </q-header>

    <div class="containerBox">
      <div class="agora">
        <q-img
          src="agora.png"
          fit="contain"
          width="150px"
          height="100px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
          @click="$router.push('/agora')"
        />
      </div>

      <div class="chavi">
        <q-img
          src="hotmilk.png"
          fit="contain"
          height="100px"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          style="
            filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg)
              brightness(96%) contrast(81%);
          "
          no-spinner
          class="q-my-sm"
          @click="$router.push('/hotmilk/agenda')"
        />
      </div>

      <div class="mindhub">
        <q-img
          src="mindhub.png"
          fit="contain"
          height="100px"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
          @click="$router.push('/mindhub')"
        />
      </div>
      <div class="chavi">
        <q-img
          src="blaze.png"
          fit="contain"
          height="100px"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
          @click="$router.push('/blaze')"
        />
      </div>
      <div class="mindhub">
        <q-img
          src="h2u.png"
          fit="contain"
          height="100px"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
          @click="$router.push('/h2u')"
        />
      </div>
      <div class="celepar">
        <q-img
          src="celepar.png"
          fit="contain"
          height="100px"
          width="150px"
          :style="
            $q.platform.is.desktop
              ? 'min-width: 50px; max-width: 150px'
              : 'min-width: 70px; max-width: 130px'
          "
          no-spinner
          class="q-my-sm"
          @click="$router.push('/celepar')"
        />
      </div>
    </div>

    <footer reveal elevated>
      <div
        style="
          height: 40px;
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          color: white;
          text-align: center;
          background-color: #fff;
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
import { Dialog } from "quasar";
export default {
  data() {
    return {};
  },
  async mounted() {},
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },
  },
  created() {
    //this.logoutForce()
  }
};
</script>

<style>
.containerBox {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 100vw;
  flex-wrap: wrap;
  margin-bottom: 80px;
}

.containerBox > div {
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 4px;
  transition: 0.5s ease-in-out;
}

.containerBox:hover {
  cursor: pointer;
}

.containerBox > div {
  width: 200px;
  margin-top: 100px;
  margin-right: 20px;
  padding: 20px;
  text-align: center;
  transition: all 500ms ease-in-out;
  background-color: #eee;
}
.containerBox > div:hover {
  margin-top: 92px;
  cursor: pointer;
  box-shadow: 0px 12px 30px 0px rgba(0, 0, 0, 0.2);
  transition: all 800ms cubic-bezier(0.19, 1, 0.22, 1);
}

.chavi {
  border-left: #d66829 3px solid;
}

.agora {
  border-left: teal 3px solid;
}

.mindhub {
  border-left: #7c4ac7 3px solid;
}

.celepar {
  border-left: #F15A5B 3px solid;
}

@media (max-width: 600px) {
}
</style>
