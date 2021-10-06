import { mapGetters } from "vuex";

export default ({ app, router, store }) => {
  app.mixin({
    methods: {
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
          else {
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
    },
  });
};
