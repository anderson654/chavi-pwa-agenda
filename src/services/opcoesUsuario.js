export class OpcoesUsuario {
  opcoes;
  /**
   *
   * @param {Type} opcoes
   */
  constructor(opcoes) {
    this.opcoes = opcoes;
  }
  requisitarCPF() {
    return this.opcoes.utilizarCPF;
  }
  requisitarEmail() {
    return this.opcoes.utilizarEmail;
  }
  utilizarLoginEmail() {
    return this.opcoes.loginEmail && this.requisitarEmail();
  }
  solicitarDocumentos() {
    return this.opcoes.utilizarDocumentos;
  }
  solicitarValidacaoDocumentos() {
    return this.solicitarDocumentos() && this.opcoes.verificarDocumentos;
  }
  utilizarWhatsApp() {
    return this.opcoes.liberarWpp;
  }
  liberarAutorizacaoWhatsApp() {
    return this.opcoes.enviarAutorizacao;
  }
}
class Type {
  /**
   *
   * @param {Boolean} utilizarCPF
   * @param {Boolean} utilizarEmail
   * @param {Boolean} loginEmail
   * @param {Boolean} utilizarDocumentos
   * @param {Boolean} verificarDocumentos
   * @param {Boolean} liberarWpp
   * @param {Boolean} enviarAutorizacao
   */
  constructor(
    utilizarCPF,
    utilizarEmail,
    loginEmail,
    utilizarDocumentos,
    verificarDocumentos,
    liberarWpp,
    enviarAutorizacao
  ) {
    this.utilizarCPF = utilizarCPF;
    this.utilizarEmail = utilizarEmail;
    this.loginEmail = loginEmail;
    this.utilizarDocumentos = utilizarDocumentos;
    this.liberarWpp = liberarWpp;
    this.verificarDocumentos = verificarDocumentos;
    this.enviarAutorizacao = enviarAutorizacao;
  }
}
