<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="flex flex-center q-gutter-x-md full-width bg-grey-3">
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex-center column">
        <q-form
          lang="pt-BR"
          ref="forms"
          @submit="onSubmit"
          @reset="onReset"
          style="width: 90vw; max-width: 500px"
        >
          <div class="full-width">
            <!-- LOGIN TELEFONE -->
            <q-input
              v-if="!loginEmail"
              class="parte1 full-width"
              type="tel"
              label-color="primary"
              style="font-size: 1.2rem"
              v-model="user.phone"
              label="Seu Telefone *"
              hint="(41) 95588-4433"
              lazy-rules
              :mask="phoneMask"
              :debounce="1000"
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Por favor, insira seu telefone.',
                (val) =>
                  (val && val.length == 15) ||
                  'Por favor, insira seu telefone no formato (41) 91122-3344.',
              ]"
            />
            <!-- CÓDIGO DE VERIFICAÇÃO -->
            <q-input
              class="parte1 full-width"
              type="tel"
              label-color="primary"
              style="font-size: 1.2rem"
              v-if="codeSent"
              v-model="user.codigoInput"
              label="Insira o Código aqui"
              lazy-rules
              mask="######"
              :debounce="1000"
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Por favor, insira seu código.',
                (val) =>
                  (val && val.length == 6) ||
                  'Por favor, insira seu código corretamente.',
              ]"
            />
            <!-- BOTÕES VALIDAR LOGIN -->
            <q-btn-group push flat unelevated class="full-width row q-mt-md">
              <q-btn
                class="col-12"
                :label="codeSent ? 'Verificar Código' : 'Enviar Código'"
                color="positive"
                @click="!codeSent ? sendCode() : checkCode()"
              />
            </q-btn-group>
          </div>
        </q-form>
      </q-page>
    </q-page-container>

    <footer></footer>
  </q-layout>
</template>

<script>
import { Loading, Notify } from "quasar";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loading: false,

      loginEmail: false,
      user: {
        name: "",
        empresa: "",
        phone: "",
        cpf: "",
        email: "",
        terms: false,
        use: false,
        hasDocs: false,
      },
      codeSent: false,
    };
  },
  computed: {
    phoneMask() {
      return "(##) #####-####";
    },
  },
  mounted() {
    if (this.$store.getters.getLogin.user) {
      this.$router.push("/hotmilk");
    } else {
      this.$store.dispatch("setarDados", {
        key: "setEstadoInicial",
        value: true,
      });
    }
  },
  methods: {
    async sendCode() {
      let response;
      if (
        !this.user ||
        (this.loginEmail && !this.user.email) ||
        (!this.loginEmail && !this.user.phone)
      ) {
        return;
      }
      Loading.show({ message: "Verificando cadastro do usuário" });
      if (this.loginEmail)
        response = await this.executeMethod({
          url: "Usuarios/verificarEmail",
          method: "post",
          data: { email: this.user.email },
        });
      else
        response = await this.executeMethod(
          {
            url: "Usuarios/loginTelefone",
            method: "post",
            data: { telefone: this.user.phone },
          },
          false
        );
      if (response.status == 200 || response.status == 201) {
        Notify.create({
          message: "Código de Confirmação enviado com Sucesso.",
          type: "positive",
        });
        this.codeSent = true;
        this.newUser = response.status == 200 ? false : true;
        if (response.status === 201) {
          this.user.codigo = response.data;
        }
      } else {
        Notify.create({
          message: "Erro ao enviar Informações ao Servidor.",
          type: "negative",
        });
      }
      Loading.hide();
    },
    async checkCode() {
      let response;
      if (this.newUser) {
        Loading.show({ delay: 400 });
        if (this.loginEmail)
          response = await this.executeMethod(
            {
              url: "Usuarios/cadastroPorEmail",
              method: "post",
              data: {
                dados: {
                  email: this.user.email,
                  codigo: this.user.codigo,
                },
              },
            },
            false
          );
        else
          response = await this.executeMethod(
            {
              url: "Usuarios/cadastrar",
              method: "post",
              data: {
                telefone: this.user.phone,
                loginCodigo: this.user.codigo,
              },
            },
            false
          );
        Loading.hide();
        if (response.status != 200) {
          Notify.create({
            message:
              "Não foi possível cadastrar o Usuário. Por favor, tente novamente.",
            type: "warning",
          });
          return;
        } else if (response.status == 200) this.newUser = false;
      }
      Loading.show({ delay: 400 });
      response = await this.executeMethod(
        {
          url: "Usuarios/novoLogin",
          method: "post",
          data: {
            username: this.loginEmail ? this.user.email : this.user.phone,
            codigo: this.user.codigoInput,
          },
        },
        false
      );
      Loading.hide();
      if (response.status == 200) {
        await this.$store.dispatch("setarDados", {
          key: "setLogin",
          value: response.data,
        });

        this.user.cpf = response.data.user.cpf;
        this.user.email = response.data.user.email;
        this.user.hasDocs =
          response.data.user.fotoFrente &&
          response.data.user.fotoAtras &&
          response.data.user.fotoSelfie;
        if (this.user.email.includes("@chaviuser")) this.user.email = "";
        if (!this.utilizarEmail && !this.utilizarDocumentos) this.nextStep();
      } else {
        Notify.create({
          message: "Número de Telefone inválido ou Código SMS incorreto.",
          type: "warning",
        });
      }
    },
    verificarEmail(valor) {
      const regexp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?/i;
      const regexp2 = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
      return regexp.test(valor) || regexp2.test(valor) || !this.utilizarEmail;
    },
    onSubmit() {
      this.$router.push("/hotmilk");
    },
    onReset() {
      this.user.name = "";
      this.user.empresa = "";
      this.user.cpf = "";
      this.user.email = "";
    },
    async nextStep() {
      const nome = this.user.name + " - " + this.user.empresa;
      if (
        this.login &&
        this.login.user &&
        (this.login.user.nome != nome ||
          this.user.email != this.login.user.email ||
          this.user.cpf != this.login.user.cpf ||
          this.user.name != this.login.user.nome)
      ) {
        const nome = this.user.name + " - " + this.user.empresa;
        let dados = {
          id: this.login.userId,
          email: this.user.email,
          cpf: this.user.cpf,
          nome: nome,
        };
        if (!this.user.email) delete dados.email;
        const response = await this.executeMethod({
          url: "Usuarios/atualizar",
          method: "POST",
          data: {
            dados: dados,
          },
        });
        if (response.status == 200) {
          this.login.user = response.data;
        }
      }
      this.$router.push("/hotmilk");
    },
  },
};
</script>

<style></style>
