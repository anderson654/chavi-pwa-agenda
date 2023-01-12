<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
        <q-img
          src="agora_logo.png"
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

    <q-page-container style="padding-top: 10px">
      <q-page padding>
        <div class="container">
          <div class="box-text">
            <span
              >Agradecemos o seu agendamento! Acesse sua chavi digital no
              <span class="text">botão abaixo</span>.
            </span>
          </div>
        </div>

        <div class="full-width text-center text-black text-h5 q-mt-lg"></div>
        <div class="full-width flex flex-center" style="margin-top: 30px">
          <div
            class="text-center column q-gutter-lg shadow-1 full-width q-py-xs q-pb-xl"
            style="border-radius: 20px"
          >
            <div class="container">
              <div class="box">
                <h1>Olá, {{ nome }}.</h1>
                <span> O agendamento da sua sala {{ mensagem }}. </span>

                <p>
                  Você foi convidado a acessar um imóvel usando a tecnologia da
                  Chavi. Para iniciar, acessa a página abaixo para fazer o
                  download do nosso <span class="text">app</span>:
                </p>

                <p>Atenciosamente, Equipe Chavi.</p>
              </div>
            </div>
            <div>
              <form action="https://chavi.com.br/app">
                <q-btn
                  class="q-pa-sm text-bold"
                  color="primary"
                  text-color="white"
                  label="Acesse sua chavi digital"
                  @click="
                    openLink(`https://app.chavi.com.br/r/${codigo}`, '_blank')
                  "
                />
              </form>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer reveal elevated>
      <div
        class="full-width bg-grey-3 text-center justify-center"
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
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      mensagem: "",
      visita: [],
      convite: [],
      status: {},
      nome: "",
      codigo: "",
    };
  },
  async mounted() {
    this.mensagem = this.catalogoMensagens(this.$route.query.collection_status);
    this.visita = this.$store.getters.getConvite;
    let filtro = this.visita.name;
    this.nome = filtro.charAt(0).toUpperCase() + filtro.slice(1);
    if (this.$route.query.collection_status === "approved") {
      let request = {
        url: "Visitas/validarVisita",
        method: "post",
        data: {
          ...this.visita,
          pagamentoAutorizado: true,
        },
      };
      const response = await this.executeMethod(request, false);
      this.codigo = response.data.codigo;
    }
  },
  methods: {
    openLink(url, target) {
      window.open(url, target);
    },

    catalogoMensagens(param) {
      let catalogo = {
        approved: "foi aprovado",
        in_process: "ainda está com o pagamento pendente",
      };

      return catalogo[param] || "";
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}

a:hover {
  filter: brightness(1.2);
}
.text {
  color: var(--q-primary);
}

.container {
  display: flex;
  justify-content: center;
  margin: 0;
}

h1 {
  font-size: 1.2rem;
  line-height: 2;
  font-weight: 600;
}

.box,
.box-text {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 2rem;
  letter-spacing: normal;
  font-family: "poppins";
  font-style: bold;
}

.box {
  width: 300px;
}

@media (max-width: 600px) {
  .box-text {
    text-align: center;
  }
}

@media (min-width: 600px) {
  h1,
  p,
  span {
    width: 100%;
    line-height: 3;
  }

  .box {
    width: 100%;
  }
}
</style>
