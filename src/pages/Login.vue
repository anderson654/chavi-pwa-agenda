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
            <!-- NOME DO USUÁRIO -->
            <q-input
              class="parte1 full-width text-h5"
              label-color="primary"
              style="font-size: 1.2rem"
              v-model="user.name"
              label="Seu nome*"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Insira o seu nome']"
            />
            <!-- NOME DA EMPRESA TODO: IMPLEMENTAR UM CAMPO SERVER SIDE PRA ISSO-->
            <q-input
              class="parte1 full-width text-h5"
              label-color="primary"
              style="font-size: 1.2rem"
              v-model="user.empresa"
              label="Sua empresa ou instituição*"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Complete esse campo',
              ]"
            />
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
            <!-- LOGIN EMAIL -->
            <q-input
              v-else
              class="parte1 full-width"
              type="email"
              label-color="primary"
              style="font-size: 1.2rem"
              v-model="user.email"
              label="Seu Email *"
              lazy-rules
              :debounce="1000"
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'Por favor, insira seu e-mail.',
                (val) =>
                  verificarEmail(val) ||
                  'Por favor, insira seu email em um formato correto.',
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
    //{"example":{"params":{"entidadeId":"5ee6bd904639f5bb55915447","imovelRef":"Meeting Point 01 - Térreo"},"login":{"id":"6uhPRGJgdK0WrZ6kvugbjccRlIFBhL7Tc8rguoz7mCH5UTaQ0DZnVsCUFZwqONFW","ttl":12096000,"created":"2023-03-20T19:09:20.834Z","userId":"640f2d53f355f21887136923","user":{"nome":"v - h","entidadeId":"5ee6bcf94639f5bb5591543f","perfilAcessoId":"5ee6d0f24639f5bb559154e2","cpf":"111.111.111-11","email":"vinicius.piazzetta@chavi.com.br","telefone":"(41) 99585-5086","canaisNotificacao":[],"dateCreated":1678716243818,"lastUpdated":1679339360826,"isFuncionario":true,"isGestorRH":false,"horasTrabalhadas":8,"notificarIGet":false,"lockerUtilizado":false,"username":"(41) 99585-5086","id":"640f2d53f355f21887136923","perfil":{"id":"640b77ab1026fa27727e93d0","name":"ADMIN"},"loginCodigo":"23fe6b37cf850f84d6755c564fd647eaf03feeca1ddcc22e50958359b3bbdf6a","entidade":{"nome":"Chavi","cpf_cnpj":"34.261.841/0001-74","email":"contato@chavi.com.br","telefone":"(41) 2170-8388","tipo":"Pessoa Jurídica - Venda","percentual_indicados":0,"formaCobrancas":{},"gestorId":null,"agencia":"","lastUpdated":1679071717583,"logoImobiliaria":"entidade-5ee6bcf94639f5bb5591543f-1649355695640.png","chaveApi":"a54a3b9d-6d99-41ad-af17-e4fae99ff976","webhook":"https://eocsn9crtqbx92a.m.pipedream.net","buscarAgendamentosVista":false,"habilitarAppLite":false,"enviarNotificacaoFechamento":false,"nivelBateriaNotificacao":50,"formularioPesquisaSatisfacao":"","opcoesValidacaoUsuario":{"utilizarCPF":false,"loginEmail":false,"enviarAutorizacao":false,"liberarWpp":false,"utilizarEmail":false,"utilizarDocumentos":false,"aprovarVisita":false,"verificarDocumentos":false},"opcoesCalendario":{"coworking":true,"limiteAgendamentoPessoa":1,"limitarAgendamentoPessoas":false,"tempoLiberarDepois":0,"tempoLiberarAntes":0,"tempoInativo":15,"tempoMinimoAprovacao":0,"tempoMaximo":60,"notificarGestor":false,"liberarAgendamento":-1,"excluirVisitaInativa":false,"avisoFechar":false,"usarPWA":false,"intervaloMin":15,"sabado":false,"domingo":false,"feriado":false,"horaInicial":"","horaFinal":""},"gerenciamentoDeSalas":{"horasDisponiveis":0,"horasExtras":0,"tipo":"Pessoa Jurídica - Venda","consomeHoras":true,"horasMensaisDisponiveis":1000},"id":"5ee6bcf94639f5bb5591543f","habilitarFeedbackApp":false,"notificarVisita":true,"habilitarRelatorioPortasAbertas":true,"acessoLocker":2,"tipoGerenciador":1},"perfilAcesso":{"nome":"Padrão Admin Cliente","tipo":"Cliente","importancia":"100","imovel":{"visualizar":true,"adicionar":true,"editar":true,"excluir":true},"equipamento":{"visualizar":true,"adicionar":false,"editar":true,"excluir":false},"usuario":{"visualizar":true,"adicionar":true,"editar":true,"excluir":true},"cliente":{"visualizar":true,"adicionar":false,"editar":true,"excluir":false},"visitante":{"visualizar":true,"adicionar":true,"editar":false,"excluir":false},"visita":{"visualizar":true,"adicionar":true,"editar":true,"excluir":true},"historico":{"visualizar":true,"adicionar":false,"editar":false,"excluir":false},"condominio":{"visualizar":false,"adicionar":false,"editar":false,"excluir":false},"formaPagamento":{"visualizar":false,"adicionar":false,"editar":false,"excluir":false},"acessoCliente":{"visualizar":true,"adicionar":true,"editar":true,"excluir":true},"id":"5ee6d0f24639f5bb559154e2","entidade":{"visualizar":false,"adicionar":false,"editar":false,"excluir":false},"convidar":{"visualizar":false,"adicionar":true,"editar":false,"excluir":false}},"entidades":[]}},"logo":"entidade-5ee6bd904639f5bb55915447-1635363609681.png","convite":{},"imovelAgendamento":{"nome":"Meeting Point 01 - Térreo","endereco":"Rua Imaculada Conceição, 1430","complemento":"Bloco 1 -  Térreo","entidadeId":"5ee6bd904639f5bb55915447","opcoesAgendamentoIndividual":{"funcionamentoIndividual":true,"tempoLiberarDepois":0,"tempoLiberarAntes":0,"tempoInativo":15,"tempoMinimoAprovacao":0,"tempoMaximo":360,"notificarGestor":false,"liberarAgendamento":-1,"excluirVisitaInativa":false,"avisoFechar":false,"intervaloMin":15,"sabado":false,"domingo":false,"feriado":false,"horaInicial":"08:00","horaFinal":"21:05","habilitarPublicoExterno":true,"emailsNotificacao":"","numeroMaximoPessoas":"1","custaCreditos":true,"consumoCreditos":"1"},"foto":"625f00befa81eb6e94b4b603-fotoUpload.jpeg","bloco":1,"andar":0,"link":"/5ee6bd904639f5bb55915447/Meeting Point 01 - Térreo"},"estadoInicial":true}}
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
      console.log("PIAZZETTA user", this.user.name + " - " + this.user.empresa);
      let response;
      const nome = this.user.name + " - " + this.user.empresa;
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
                  nome: nome.trim(),
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
                nomeCompleto: nome.trim(),
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
      console.log("PIAZZETTA onSumit");
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
