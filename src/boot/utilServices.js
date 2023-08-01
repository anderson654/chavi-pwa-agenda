import { mapGetters } from "vuex";
import Compressor from "compressorjs";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { Loading, Notify } from "quasar";
import internet from "await-internet";
import { Dialog } from "quasar";

export default ({ app, router, store }) => {
  app.component(VueQrcode.name, VueQrcode);
  app.mixin({
    computed: {
      ...mapGetters({
        getParams: "getParams",
        getLogin: "getLogin",
        getEstadoInicial: "getEstadoInicial",
      }),
      login: {
        get() {
          return JSON.parse(JSON.stringify(this.$store.getters.getLogin));
        },
      },
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      async executeMethod(data, b, excluirAuthorization) {
        let response;
        let errorMsg = "";
        try {
          if (
            this.getLogin &&
            this.getLogin.id &&
            excluirAuthorization !== true
          )
            this.$api.defaults.headers.common.Authorization = this.getLogin.id;
          else delete this.$api.defaults.headers.common.Authorization;
          response = await this.$api.request(data);
        } catch (e) {
          response = e.response;
        }
        response = response || {};
        if (response && response.status !== 200 && response.status !== 204) {
          if (response.status === 0)
            errorMsg =
              "Erro conectando ao servidor, por favor tente novamente mais tarde";
          else if (response.status == 401) {
            Notify.create({
              message: "Token de acesso expirou, faça seu login novamente",
              type: "warning",
            });
            this.logout(true);
          } else {
            errorMsg =
              "code: " +
              response.status +
              " - " +
              (response.statusText || "") +
              "<br>";
            if (response.data && response.data.message)
              errorMsg =
                "code: " +
                (response.statusCode || "") +
                " - " +
                (response.name || "") +
                "<br>" +
                response.data.message;
            if (
              response.data &&
              response.data.error &&
              response.data.error.message
            )
              errorMsg = response.data.error.message;
          }
        } else {
          if (!response.status)
            this.mostrarNotificacao({ message: "Sem conexão de internet." });
          else if (errorMsg !== "" && b !== false) {
            bus.emitEvent("reportError", {
              macBluetooth: "0",
              status: "F06",
              errorMsg: errorMsg,
            });
            this.mostrarNotificacao({ message: errorMsg, html: true });
          }
        }
        return response;
      },
      async blobArquivo(arquivo) {
        return new Promise((resolve) => {
          window.resolveLocalFileSystemURL(
            arquivo,
            function (fileEntry) {
              fileEntry.file(
                function (file) {
                  var reader = new FileReader();
                  reader.onload = function () {
                    resolve({
                      blob: new Blob([new Uint8Array(reader.result)]),
                      name: file.name,
                    });
                  };
                  reader.onerror = function (e) {
                    console.log(e);
                    resolve(null);
                  };
                  reader.readAsArrayBuffer(file);
                },
                function (e) {
                  console.log(e);
                  resolve(null);
                }
              );
            },
            function (e) {
              console.log(e);
              resolve();
            }
          );
        });
      },
      isBlank(o) {
        return o === null || o === undefined || o === "";
      },
      async compressImage(file) {
        return new Promise((resolve, reject) => {
          new Compressor(file, {
            maxHeight: 512,
            maxWidth: 512,
            resize: "contain",
            quality: 0.75,
            convertSize: 500000,
            success(result) {
              resolve(result);
            },
            error(e) {
              console.log(e);
              resolve(file);
            },
          });
        });
      },
      /**
       * Verifica se a conexão da internet está estável
       * @returns Boolean
       */
      checkConnectionStatus() {
        return new Promise((resolve, reject) => {
          Loading.show({
            message: "Verificando status da conexão de internet",
          });
          internet({
            test: ["agenda.chavi.com.br", "google.com.br"],
            maxTries: 5,
            pause: 5000,
            timeout: 10000,
            maxWait: 100000,
          })
            .then(() => {
              console.log("Connected to internet");
              resolve(true);
            })
            .catch((e) => {
              console.log("Error connection to internet", e);
              reject(false);
            })
            .finally(() => {
              Loading.hide();
            });
        });
      },
      escolherBloco(bloco){
        if(bloco == undefined){
          this.selecionarBloco = true;  
        }else{
          this.selecionarBloco = false;
        }
        this.selecionarAndar = true;
        this.blocoSelecionado = bloco;
      },
      escolherAndar(andar){
  
        if(andar == undefined){
          this.selecionarAndar = true;
        }else{
          this.selecionarAndar = false;
        }
  
        this.andarSelecionado = andar;
      },
      agendamento(imovel, andar, bloco) {
        this.$store.dispatch("setarDados", {
          key: "setImovelAgendamento",
          value: imovel,
        });
        this.$store.dispatch("setarDados", {
          key: "setAndarSelecionado",
          value: andar,
        });
        this.$store.dispatch("setarDados", {
          key: "setBlocoSelecionado",
          value: bloco,
        });
        return;
      },
      async logoutForce() {
        if (this.getLogin.user) {
          await this.$store.dispatch("setarDados", {
            key: "setLogin",
            value: [],
          });
  
          this.$store.dispatch("setarDados", {
            key: "setEstadoInicial",
            value: true,
          });
  
          return;
        }
      }
    },
  });
};
