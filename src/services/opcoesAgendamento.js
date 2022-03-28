export class OpcoesAgendamento {
  opcoes;
  /**
   *
   * @param {Type} opcoes
   */
  constructor(opcoes) {
    this.opcoes = opcoes;
  }

  liberarSabado() {
    return this.opcoes && this.opcoes.sabado;
  }
  liberarDomingo() {
    return this.opcoes && this.opcoes.domingo;
  }
  liberarFeriado() {
    return this.opcoes && this.opcoes.feriado;
  }
  liberarAcionamentoPWA() {
    return this.opcoes && this.opcoes.usarPWA;
  }
  limitarAgendamentoPessoas() {
    return this.opcoes && this.opcoes.limitarAgendamentoPessoas;
  }
  limiteAgendamentoPessoaPermitido() {
    return this.limitarAgendamentoPessoas
      ? this.opcoes.limiteAgendamentoPessoa
      : -1;
  }
  excluirVisitaInativa() {
    return this.opcoes.excluirVisitaInativa;
  }
  notificarFechamento() {
    return this.opcoes.avisoFechar;
  }
  notificarPortaAberta() {
    return this.opcoes.notificarGestor;
  }
  enviarParaAprovacao(duracaoVisita, aprovarAutomaticamente = false) {
    return (
      aprovarAutomaticamente && this.opcoes.tempoMinimoAprovacao < duracaoVisita
    );
  }
  horaInicialPermitida() {
    return this.opcoes.horaInicial ? this.opcoes.horaInicial : "";
  }
  horaFinalPermitida() {
    return this.opcoes.horaFinal ? this.opcoes.horaFinal : "";
  }
  intervaloCalendario() {
    return this.opcoes.intervaloMin;
  }
  tempoLiberadoAcessoAntes() {
    return this.opcoes.tempoLiberarAntes;
  }
  tempoLiberadoAcessoDepois() {
    return this.opcoes.tempoLiberarDepois;
  }
  tempoInativoPermitido() {
    return this.excluirVisitaInativa ? this.opcoes.tempoInativo : -1;
  }
  tempoAgendamentoFuturo() {
    return this.opcoes.liberarAgendamento > -1
      ? this.opcoes.liberarAgendamento
      : false;
  }
  duracaoMaximaAgendamento() {
    return this.opcoes.tempoMaximo;
  }
}
class Type {
  /**
   *
   * @param {Boolean} avisoFechar               //OK
   * @param {Boolean} excluirVisitaInativa      //OK
   * @param {Boolean} usarPWA                   //OK
   * @param {Boolean} sabado                    //OK
   * @param {Boolean} feriado                   //OK
   * @param {Boolean} domingo                   //OK
   * @param {Number} tempoMaximo                //OK
   * @param {Number} intervaloMin               //OK
   * @param {Number} tempoMinimoAprovacao       //OK
   * @param {Number} tempoInativo               //OK
   * @param {Number} tempoLiberarAntes          //OK
   * @param {Number} tempoLiberarDepois         //OK
   * @param {Boolean} limitarAgendamentoPessoas //OK
   * @param {Number} limiteAgendamentoPessoa    //OK
   * @param {String} horaFinal                  //OK
   * @param {String} horaInicial                //OK
   * @param {Number} liberarAgendamento         //OK
   * @param {Boolean} notificarGestor
   */
  constructor(
    avisoFechar,
    excluirVisitaInativa,
    usarPWA,
    sabado,
    feriado,
    domingo,
    tempoMaximo,
    intervaloMin,
    tempoMinimoAprovacao,
    tempoInativo,
    tempoLiberarAntes,
    tempoLiberarDepois,
    limitarAgendamentoPessoas,
    limiteAgendamentoPessoa,
    horaFinal,
    horaInicial,
    liberarAgendamento,
    notificarGestor
  ) {
    this.avisoFechar = avisoFechar;
    this.excluirVisitaInativa = excluirVisitaInativa;
    this.usarPWA = usarPWA;
    this.sabado = sabado;
    this.domingo = domingo;
    this.feriado = feriado;
    this.tempoMaximo = tempoMaximo;
    this.intervaloMin = intervaloMin;
    this.tempoMinimoAprovacao = tempoMinimoAprovacao;
    this.tempoInativo = tempoInativo;
    this.tempoLiberarAntes = tempoLiberarAntes;
    this.tempoLiberarDepois = tempoLiberarDepois;
    this.limitarAgendamentoPessoas = limitarAgendamentoPessoas;
    this.limiteAgendamentoPessoa = limiteAgendamentoPessoa;
    this.horaFinal = horaFinal;
    this.horaInicial = horaInicial;
    this.liberarAgendamento = liberarAgendamento;
    this.notificarGestor = notificarGestor;
  }
}
