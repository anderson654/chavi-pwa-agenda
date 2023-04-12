<template>
  <div v-if="isHotmilk || this.isAgora">
    <q-btn
      style="font-size: 0.7rem"
      icon="home"
      flat
      dense
      color="secondary"
      class="home-icon"
      @click="$router.push(`${routeCoworking}`)"
    />
  </div>
  <q-page class="flex-center column">
    <!-- SEM IMÓVEL -->
    <div
      v-if="semImovel"
      style="height: 100vvh; font-color: black; font-size: 1.5rem"
      class="absolute-center row full-width justify-around q-gutter-md"
    >
      <q-btn
        color="primary"
        style="width: 200px; min-width: 150px; height: 125px"
        @click="$router.push(`${routeCoworking}`)"
      >
        <q-img
          src="hotmilk.png"
          style="filter: invert(23%) sepia(99%) saturate(4%) hue-rotate(359deg) brightness(96%) contrast(81%);
          "
        />
      </q-btn>
    </div>
    <!-- <div v-if="parte == 4">
      <button @click="this.parte = 5">Próxima</button>
    </div> -->

    <!-- CALENDÁRIO -->
    <div v-else class="flex-center column">
      <!-- TÍTULOS/HEADES -->
      <div class="text-center q-my-lg" style="width: 70vw">
        <div v-if="inForms">
          <span style="font-size: 1.4rem" v-if="parte == 1">
            Agora, insira seu nome e telefone.<br />
            Em seguida, aguarde receber um código SMS e insira no campo
            indicado.
          </span>
          <span style="font-size: 1.4rem" v-if="parte == 2">
            Preencha seus dados:
          </span>
          <div v-if="parte == 3">
            <span style="font-size: 1.4rem">Estamos quase finalizando.</span>
            <br />
            <span style="font-size: 1.1rem">
              Para aumentarmos a segurança da sua visita, precisamos que valide
              seu documento de identificação (RG ou CNH)
            </span>
          </div>
          <div v-if="parte == 4">
            <span style="font-size: 1.4rem" class="text-primary">
              Sua reserva em {{ user.imovelRef }} está quase pronta
            </span>
            <div class="full-width flex justify-center q-mt-sm">
              <q-img
                v-if="logo"
                :src="logo"
                spinner-color="primary"
                fit="contain"
                style="max-width: 300px"
              />
            </div>
            <br />
            <span style="font-size: 1.2rem"
              >Agora é só revisar os dados e enviar a solicitação de
              agendamento.</span
            >
          </div>
        </div>
        <div v-else class="text-center column">
          <span
            style="font-size: 1.4rem; color: #505050"
            v-html="botaoCalendario"
            @click="goBack"
          >
          </span>
          <span
            style="font-size: 1.2rem; color: #505050"
            v-html="tituloCalendario"
          >
          </span>
        </div>
        <!--AQUI-->
        <img
        
          :src="logo"
          spinner-color="#9654ff"
          class="img-salas"
        />
        
      </div>

      <!-- CALENDÁRIO -->
      <div class="full-width" v-if="!inForms">
        <div class="row justify-center items-center">
          <div class="col-12 row justify-center items-center">
            <!-- BTN NAVEGAÇÃO -->
            <div
              v-if="
                imovel.opcoesDeCredito.descritivo &&
                imovel.opcoesDeCredito.descritivo.length > 0
              "
            >
              <div class="descritivo">
                <div class="descritivo-title">
                  <p>Descritivo do imóvel:</p>
                </div>

                <div
                  v-for="descritivo in imovel.opcoesDeCredito.descritivo"
                  :key="descritivo"
                  class="q-py-xs"
                >
                  <li>
                    <span class="descrt">
                      {{ descritivo }}
                    </span>
                  </li>
                </div>
              </div>
            </div>
            <div class="col-12">
              <navigation-bar
                @today="onTodayMonth"
                @prev="onPrevMonth"
                @next="onNextMonth"
              />
            </div>
            <div
              class="row justify-center items-center full-width"
              style="font-size: 1rem"
            >
              <span
                style="color: #505050; font-size: 1.6rem; font-weight: bold"
              >
                {{ getMonth.toUpperCase() }}
              </span>
            </div>
            <!-- NAVEGAÇÃO (MESES) VERSÃO MOBILE -->
            <div style="width: 80%" v-if="!$q.platform.is.desktop">
              <q-calendar-month
                ref="calendarMonth"
                v-model="selectedDate"
                bordered
                mini-mode
                locale="pt-br"
                :weekdays="getWeekDisplay"
                :disabled-before="disabledBefore"
                :disabled-after="disabledAfter"
                @click-date="onClickDate"
              />
            </div>
          </div>
          <div
            class="q-mt-md"
            style="width: 90%"
            v-if="!$q.platform.is.desktop"
          >
            <q-separator color="primary" size="3px" />
          </div>
        </div>
        <!-- CALENDÁRIO PARA AGENDAMENTO -->
        <div class="flex flex-center q-pa-md">
          <div style="width: 80%">
            <q-calendar
              ref="calendar"
              weekday-align="left"
              :view="$q.platform.is.desktop ? 'week' : 'day'"
              locale="pt-br"
              style="width: 100%"
              cell-height="100px"
              :weekdays="getWeekDisplay"
              :hoverable="true"
              :interval-minutes="timeStepMin"
              :interval-start="intervalStart"
              :interval-count="intervalCount"
              :disabled-before="disabledBefore"
              :disabled-after="disabledAfter"
              bordered
              hour24-format
              v-model="selectedDate"
              @click-time="onTimeClick"
            >
              <template
                #day-body="{
                  scope: { timestamp, timeStartPos, timeDurationHeight },
                }"
              >
                <template v-if="true">
                  <template
                    v-for="(event, index) in getEvents(timestamp.date)"
                    :key="index"
                  >
                    <div
                      v-if="event.time !== undefined"
                      class="my-event"
                      :class="badgeClasses(event, 'body')"
                      :style="
                        badgeStyles(event, timeStartPos, timeDurationHeight)
                      "
                    >
                      <div class="title q-calendar__ellipsis">
                        <span class="text-center" v-html="event.title"></span>
                        <q-tooltip>{{ event.time }}</q-tooltip>
                      </div>
                    </div>
                  </template>
                  <template
                    v-for="(holiday, index) in getHoliday(timestamp.date)"
                    :key="index"
                  >
                    <div
                      v-if="holiday && !liberarFeriado"
                      class="my-event full-width rounded-border bg-green-10"
                      style="top: 0px; height: 100%; align-items: flex-start"
                    >
                      <div
                        class="title q-calendar__ellipsis text-black text-center"
                        style="font-size: 1.2rem"
                      >
                        Feriado <br />
                        {{ holiday.dia }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </q-calendar>
          </div>
        </div>
      </div>
      <q-form
        v-if="inForms"
        lang="pt-BR"
        ref="forms"
        @submit="onSubmit"
        @reset="onReset"
        @validation-error="onValError"
        style="width: 90vw; max-width: 500px"
      >
        <!-- LOGIN -->
        <div v-show="parte == 1" class="full-width">
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
            v-if="isCoworking"
            class="parte1 full-width text-h5"
            label-color="primary"
            style="font-size: 1.2rem"
            v-model="user.empresa"
            label="Sua empresa ou instituição*"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Complete esse campo']"
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
                (val !== null && val !== '') || 'Por favor, insira seu e-mail.',
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
                (val !== null && val !== '') || 'Por favor, insira seu código.',
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
        <!-- DADOS DO USER -->
        <div v-show="parte == 2" class="full-width">
          <!-- NOME -->
          <q-input
            class="parte1 full-width"
            label-color="primary"
            style="font-size: 1.2rem"
            v-model="user.name"
            label="Seu nome *"
            hint="Nome e sobrenome"
            lazy-rules
            clearable
            :rules="[(val) => (val && val.length > 0) || 'Insira um nome']"
          />
          <!-- NOME DA EMPRESA TODO: IMPLEMENTAR UM CAMPO SERVER SIDE PRA ISSO-->
          <q-input
            v-if="isCoworking"
            class="parte1 full-width text-h5"
            label-color="primary"
            style="font-size: 1.2rem"
            v-model="user.empresa"
            label="Sua empresa ou instituição*"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Complete esse campo']"
          />
          <!-- TELEFONE -->
          <q-input
            class="parte1 full-width"
            type="tel"
            v-model="user.phone"
            label-color="primary"
            style="font-size: 1.2rem"
            label="Seu Telefone *"
            hint="(41) 98888-8888"
            lazy-rules
            :mask="phoneMask"
            :readonly="!loginEmail"
            clearable
            :debounce="1000"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                'Por favor, insira seu telefone.',
              (val) =>
                (val && val.length == 15) ||
                'Por favor, insira seu telefone no formato desejado.',
            ]"
          >
            <template v-slot:append>
              <q-btn
                style="font-size: 0.7rem"
                icon="logout"
                flat
                dense
                color="secondary"
                @click="logout()"
              />
            </template>
          </q-input>
          <!-- EMAIL -->
          <q-input
            class="parte1 full-width"
            type="email"
            v-model="user.email"
            v-if="utilizarEmail"
            label-color="primary"
            style="font-size: 1.2rem"
            label="Seu E-mail"
            lazy-rules
            clearable
            :debounce="1000"
            :rules="[
              (val) => (val) =>
                verificarEmail(val) || 'Insira um e-mail válido',
            ]"
          >
            <template v-slot:append>
              <q-btn
                v-if="loginEmail"
                style="font-size: 0.7rem"
                icon="logout"
                flat
                dense
                color="secondary"
                @click="logout()"
              />
            </template>
          </q-input>
          <!-- CPF -->
          <q-input
            v-if="utilizarCPF"
            class="parte1 full-width"
            type="tel"
            v-model="user.cpf"
            label-color="primary"
            style="font-size: 1.2rem"
            label="Seu CPF *"
            hint="000.000.000-00"
            lazy-rules
            clearable
            mask="###.###.###-##"
            :debounce="1000"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Por favor, insira seu CPF.',
              (val) => verificarCPF(val) || 'Digite um CPF válido',
            ]"
          />
          <!-- BOTÕES DE AÇÃO -->
          <div class="full-width q-mt-xl">
            <q-btn-group
              push
              flat
              class="row full-width justify-center q-mb-xs"
            >
              <q-btn
                class="col-10 red-button"
                style="font-size: 0.7rem"
                label="Escolher outro horário"
                @click="
                  inForms = false;
                  events.pop();
                "
              />
            </q-btn-group>
            <q-btn-group push flat unelevated class="full-width row">
              <q-btn
                label="Limpar"
                type="reset"
                class="q-mr-xs col-6 red-button"
              />
              <q-btn
                class="col-6 q-ml-xs purple-button"
                label="Próximo"
                @click="nextStep()"
              />
            </q-btn-group>
          </div>
        </div>
        <!-- AQUISIÇÃO DAS FOTOS DOS DOCUMENTOS -->
        <div
          v-show="parte == 3 && utilizarDocumentos"
          class="full-width q-mt-lg"
        >
          <div v-if="isDesktop" class="full-width text-center">
            <span class="full-width" style="font-size: 1.1rem">
              Caso queria, escaneie esse QRCode para continuar pelo smartphone.
            </span>
            <div>
              <vue-qrcode
                :value="qrcode"
                :options="{ width: 200 }"
              ></vue-qrcode>
            </div>
          </div>
          <div class="full-width">
            <div class="full-width text-center" style="font-size: 1.1rem">
              <span
                ><strong>Primeiro</strong>, tire ou selecione uma
                <strong>foto frontal</strong> seu documento de
                identificação</span
              >
            </div>
            <div class="full-width row">
              <div class="col-12 q-pr-xs">
                <q-file
                  v-model="fotoFrente"
                  accept="image/*"
                  :max-files="1"
                  clearable
                  borderless
                  label-color="primary"
                  label="Anexar Foto Frontal"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
            <div
              class="full-width q-mt-md text-center"
              style="font-size: 1.1rem"
            >
              <span
                ><strong>Segundo</strong>, tire ou selecione uma
                <strong>foto do verso</strong> do seu documento de
                identificação</span
              >
            </div>
            <div class="full-width row">
              <div class="col-12 q-pr-xs">
                <q-file
                  v-model="fotoVerso"
                  accept="image/*"
                  :max-files="1"
                  clearable
                  borderless
                  label-color="primary"
                  label="Anexar Foto do Verso"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
            <div
              class="full-width text-center q-mt-md"
              style="font-size: 1.1rem"
            >
              <span
                ><strong>Terceiro</strong>, tire ou selecione uma
                <strong>selfie</strong> para comparar com seu documento</span
              >
            </div>
            <div class="full-width row">
              <div class="col-12 q-pr-xs">
                <q-file
                  v-model="fotoSelfie"
                  accept="image/*"
                  :max-files="1"
                  clearable
                  borderless
                  label-color="primary"
                  label="Anexar Selfie"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
          </div>
          <div class="full-width q-mt-sm q-mb-md">
            <q-btn-group push flat unelevated class="full-width row">
              <q-btn
                outline
                label="Voltar"
                color="secondary"
                class="col-6 q-mr-xs"
                @click="parte -= 1"
              />
              <q-btn
                class="col-6 q-ml-xs"
                label="Revisar"
                color="positive"
                @click="parte += 1"
              />
            </q-btn-group>
          </div>
        </div>
        <!-- REVISÃO DOS DADOS -->
        <div v-if="parte == 4" class="full-width flex flex-left">
          <div class="full-width" style="font-size: 1.2rem">
            <div class="row margin-bt">
              <div class="col-3">Nome:</div>
              <div class="col-9 text-bold">{{ getPrimeiroNome }} </div>
            </div>
            <div class="row margin-bt" v-if="isCoworking && user.empresa">
              <div class="col-3">Empresa:</div>
              <div class="col-9 text-bold">{{ user.empresa }} </div>
            </div>
            <div class="row margin-bt">
              <div class="col-3">Telefone:</div>
              <div class="col-9 text-bold">{{ user.phone }} </div>
            </div>
            <div class="row margin-bt" v-if="utilizarEmail">
              <div class="col-3">E-mail:</div>
              <div
                class="col-9 text-bold"
                style=" overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; white-space: normal;">
                {{ user.email }}
              </div>
            </div>
            <div class="row margin-bt" v-if="utilizarCPF">
              <div class="col-3">CPF:</div>
              <div class="col-9-shrink text-bold">{{ user.cpf }}</div>
            </div>
            <div class="row margin-bt">
              <div class="col-3">Data:</div>
              <div class="col text-bold">{{ parseData }}</div>
            </div>

            <div class="row margin-bt" v-if="getEndereco">
              <div class="col-3">Local:</div>

              <div class="col-9 text-bold" v-html="getEnderecoHtml"></div>
            </div>
            <div v-if="necessitaPagamento">
              <div class="row">
                <div class="col-5">Preço 15 minutos:</div>
                <div class="col-7 text-bold">
                  R$ {{ filtraValor(valorDaSala) }}
                </div>
              </div>
              <div class="row">
                <div class="col-5">Preço total:</div>
                <div class="col-7 text-bold">
                  R$
                  {{ filtraValor() }}
                </div>
              </div>
            </div>
            <div v-if="!user.hasDocs && utilizarDocumentos" class="row q-mt-md">
              <div class="col-5">Foto Frente:</div>
              <div class="col-7">
                <q-img
                  v-if="fotoFrente"
                  :src="getFotoFrente"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
              <div class="col-5 q-my-md">Foto Verso:</div>
              <div class="col-7 q-my-md">
                <q-img
                  v-if="fotoVerso"
                  :src="getFotoAtras"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
              <div class="col-5">Foto Selfie:</div>
              <div class="col-7">
                <q-img
                  v-if="fotoSelfie"
                  :src="getFotoSelfie"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
            </div>
          </div>
          <div class="text-h8 q-mt-md text-justify">
            <!-- TODO: Ajustar checkbox -->
            <q-checkbox v-model="user.terms" />
            <span>
              Declaro que li e concordo com os
              <a href="https://chavi.com.br/termos" target="_blank">
                termos de uso e privacidade
              </a>
              .
            </span>
          </div>
          <div class="text-h8 q-mt-md text-justify">
            <q-checkbox v-model="user.use" />
            <span>
              Declaro que li e concordo com os
              <a @click="termosDeUso" class="fakelink">
                termos de utilização da sala</a
              >.
            </span>
          </div>
          <q-btn-group push flat unelevated class="full-width row q-my-md">
            <q-btn
              outline
              label="Voltar"
              color="secondary"
              class="col-6 q-mr-xs"
              @click="
                utilizarDocumentos && !user.hasDocs
                  ? (parte -= 1)
                  : this.$router.back()
              "
            />

            <q-btn
              class="col-6 q-ml-xs"
              label="Solicitar"
              color="positive"
              type="submit"
              v-if="necessitaAprovacao && !necessitaPagamento"
            />

            <q-btn
              class="col-6 q-ml-xs"
              label="Enviar"
              type="submit"
              color="positive"
              v-if="!necessitaAprovacao && !necessitaPagamento"
            />

            <q-btn
              class="col-6 q-ml-xs"
              label="Pagamento"
              @click="checkoutPagamento"
              color="positive"
              v-if="necessitaPagamento"
            />
          </q-btn-group>
          <div class="cho-container"></div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { Loading, Notify, } from "quasar";
import * as moment from "moment";
import { QCalendarDay } from "@quasar/quasar-ui-qcalendar/dist/QCalendarDay.esm.js";
import { QCalendarMonth } from "@quasar/quasar-ui-qcalendar/dist/QCalendarMonth.esm.js";
import NavigatioBar from "components/NavigationBar.vue";
import axios from "axios";
import {
  addToDate,
  parseTimestamp,
  parseTime,
  today,
  parsed,
  isBetweenDates,
} from "@quasar/quasar-ui-qcalendar/dist/index.esm.js";
import "@quasar/quasar-ui-qcalendar/dist/QCalendarVariables.css";
import "@quasar/quasar-ui-qcalendar/dist/QCalendarTransitions.css";
import "@quasar/quasar-ui-qcalendar/dist/QCalendarDay.css";
import { Dialog } from "quasar";
import StyleBloco from "src/components/styleBloco.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    "q-calendar": QCalendarDay,
    "navigation-bar": NavigatioBar,
    "q-calendar-month": QCalendarMonth,
    "style-bloco": StyleBloco,
  },
  data() {
    return {
      contador: 0,
      idImovel: "",
      seMesmoDia: "",
      salasHotMilkValidarEntrada: false,
      emailAvisoAgendamento: "",
      whatsappAvisoAgendamento: "",
      inForms: false,
      codeSent: false,
      semImovel: false,
      parte: 1,
      selectedDate: "",
      valorDoAgendamento: 0,
      duracao: "",
      type: "",
      cliente: {},
      events: [],
      /* Info User */
      fotoFrente: [],
      fotoSelfie: [],
      fotoVerso: [],
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
      newUser: true,
      isRegistredUser: false,
      /* Opções calendario */
      utilizarDocumentos: true,
      verificarDocumentos: true,
      aprovarVisita: false,
      utilizarEmail: true,
      loginEmail: false,
      utilizarCPF: false,
      /* Opções visitas */
      isCoworking: false,
      domingo: false,
      liberarFeriado: false,
      habilitarPublicoExterno: false,
      horaFinal: 24,
      horaInicial: 0,
      timeStepMin: 15,
      necessitaAprovacao: false,
      chaveAgendamento: "",
      liberarAgendamento: -1,
      sabado: false,
      tempoMaximo: 60,
      tempoMinimoAprovacao: 0,
      numeroVisitantesExternos: 0,
      redirecionarPagamento: true,
      entidadeUsuario: "",
      imovel: {
        opcoesDeCredito: {
          descritivo: [],
          tipoEvento: {},
        },
      },
      maximoPessoas: "",
      eventoOutros: [],
      publicoExterno: false,
    };
  },
  computed: {
    parseData() {
      if (this.user.validadeInicial && this.user.validadeFinal) {
        const inicial = moment(new Date(this.user.validadeInicial));
        const final = moment(new Date(this.user.validadeFinal));
        this.seMesmoDia =
          inicial.format("DD/MM/YYYY") == final.format("DD/MM/YYYY");

        if (this.seMesmoDia) {
          this.seMesmoDia =
            inicial.format("DD/MM/YYYY HH:mm") + " - " + final.format("HH:mm");
        } else {
          this.seMesmoDia =
            inicial.format("DD/MM/YYYY HH:mm") +
            " - " +
            final.format("DD/MM/YYYY HH:mm");
        }
        return this.seMesmoDia;
      }
      return "";
    },

    tempoMinimoAprovacaoLabel() {
      const aux = this.isHotmilk ? 
      [
        { value: 30, label: "30 minutos" },
        { value: 45, label: "45 minutos" },
        { value: 60, label: "1 hora" },
        { value: 90, label: "1 hora e 30 min" },
        { value: 120, label: "2 hora" },
        { value: 180, label: "3 hora" },
        { value: 240, label: "4 hora" },
        { value: 300, label: "5 hora" },
        { value: 360, label: "6 hora" },
      ] : [
        { value: 15, label: "15 minutos" },
        { value: 30, label: "30 minutos" },
        { value: 45, label: "45 minutos" },
        { value: 60, label: "1 hora" },
        { value: 90, label: "1 hora e 30 min" },
        { value: 120, label: "2 hora" },
        { value: 180, label: "3 hora" },
        { value: 240, label: "4 hora" },
        { value: 300, label: "5 hora" },
        { value: 360, label: "6 hora" },
      ];

      return aux.find((item) => {
        return item.value == this.tempoMinimoAprovacao;
      }).label;
    },
    logo() {
      let path = `${process.env.VUE_APP_API_URL}/StorageContainers/fotoImovel/download/`;
      if (
        this.cliente &&
        this.cliente.fotoImovel &&
        this.cliente.fotoImovel.indexOf("https://") > -1
      )
        return this.cliente.fotoImovel;
      return this.cliente && this.cliente.fotoImovel
        ? path + this.cliente.fotoImovel
        : false;
    },
    getEndereco() {
      let resultado = "";
      if (this.cliente && this.cliente.enderecoImovel) {
        resultado = this.user.imovelRef + " - " + this.cliente.enderecoImovel;
      } else if (this.user.imovelRef) {
        resultado = this.user.imovelRef;
      }
      return resultado;
    },
    getEnderecoHtml() {
      let resultado = this.user.imovelRef;
      return resultado.replace("\n", "");
    },

    // pega o primeiro Nome
    getPrimeiroNome(){
      let res = this.user.name.split(" ");
      return res[0];
    },

    botaoCalendario() {
      return `<button
      class="red-button"style="max-width: 120px; border: none; border-radius: 16px; cursor: pointer; height: 40px;
      margin-top: 8px;
      margin-bottom: 16px;
      ;">
          <span class="material-icons" style="scale: 2.8;">arrow_left</span>
          voltar
        </button>
        <br>`;
    },

    tituloCalendario() {
      let ref = this.user.imovelRef;
      return !this.isCoworking
        ? "Agende o melhor  dia<br> e hora para utilizar:<br> <strong> <p style='font-size: 1.8rem; margin-bottom: 16px;'>" +
            ref +
            ". </strong> </p>"
        : `
        <p style="font-family:'igualfina'; font-weight: lighter; line-height: 25px;" >Agende o melhor<br>dia e hora para utilizar:<br></p>
          <p style="line-height: 0px;margin:0; pedding:0; font-size:1.67rem;font-family:'igualnegrito'; margin-bottom: 15px;">${ref.split("-")[0].toUpperCase()}</p> `;
    },
    isHotmilk() {
      return false
//==============================================================================
      //código comentado para iniibir a parte de créditos
      // (
      //   this.cliente &&
      //   this.cliente.nome &&
      //   (this.cliente.nome.toString().toLowerCase() == "hotmilk" ||
      //     this.cliente.nome.toString().toLowerCase() == "dormakaba")
      // );
//===============================================================================
    },
    isAgora() {
      return this.cliente.nome == "Ágora Tech Park";
    },
    routeCoworking() {
      return this.cliente.nome == "Ágora Tech Park" ? "agora" : "hotmilk";
    },

    getMonth() {
      const mes = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      const mesNum = this.selectedDate
        ? this.selectedDate.split("-")[1]
        : moment().format("MM");
      return mes[parseInt(mesNum)];
    },
    isDesktop() {
      return this.$q.platform.is.desktop;
    },
    getFotoFrente() {
      try {
        return URL.createObjectURL(this.fotoFrente);
      } catch {
        return this.fotoFrente;
      }
    },
    getFotoAtras() {
      try {
        return URL.createObjectURL(this.fotoVerso);
      } catch {
        return this.fotoVerso;
      }
    },
    getFotoSelfie() {
      try {
        return URL.createObjectURL(this.fotoSelfie);
      } catch {
        return this.fotoSelfie;
      }
    },
    login: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.getters.getLogin));
      },
      set(value) {
        const key = "setLogin";
        this.$store.dispatch("setarDados", { key: key, value: value });
      },
    },
    eventsMap() {
      const map = {};
      this.events.forEach((event) => {
        map[event.date] = map[event.date] ? map[event.date] : [];
        map[event.date].push(event);
        if (event.days) {
          let timestamp = parseTimestamp(event.date);
          let days = event.days;
          do {
            timestamp = addToDate(timestamp, { day: 1 });
            if (!map[timestamp.date]) {
              map[timestamp.date] = [];
            }
            map[timestamp.date].push(event);
          } while (--days > 0);
        }
      });
      return map;
    },
    intervalStart() {
      let intervalo = 60 / this.timeStepMin;
      return this.horaInicial * intervalo;
    },
    intervalCount() {
      let horas = this.horaFinal - this.horaInicial;
      let intervalo = 60 / this.timeStepMin;
      return horas * intervalo;
    },
    disabledBefore() {
      let ts = parseTimestamp(today());
      ts = addToDate(ts, { day: -1 });
      return ts.date;
    },
    disabledAfter() {
      if (!this.liberarAgendamento || this.liberarAgendamento < 0) return;
      let ts = parseTimestamp(today());
      ts = addToDate(ts, {
        day: this.liberarAgendamento + 1,
      });
      return ts.date;
    },
    phoneMask() {
      return "(##) #####-####";
    },
    getWeekDisplay() {
      let week = [1, 2, 3, 4, 5];
      if (this.domingo) week.unshift(0);
      if (this.sabado) week.push(6);
      setTimeout(() => {
        this.onNextMonth();
        setTimeout(() => {
          this.onTodayMonth();
        }, 200);
      }, 200);
      return week;
    },
  },
  mounted() {
    try {
      this.selectedDate = today();
      if (this.login && this.login.user) {
        const vetor = this.login.user.nome.split("-");
        const nome = vetor[0].trim();
        const empresa = vetor.length > 1 ? vetor[1].trim() : "";
        this.user = {
          name: nome,
          empresa: empresa,
          phone: this.login.user.telefone,
          email: this.login.user.email,
          cpf: this.login.user.cpf,
          hasDocs:
            this.login.user.fotoSelfie &&
            this.login.user.fotoFrente &&
            this.login.user.fotoAtras,
          terms: false,
          use: false,
        };
        this.maximoPessoas =
          this.$store.getters.getImovelAgendamento.opcoesAgendamentoIndividual.numeroMaximoPessoas;
        if (this.user.email.includes("@chaviuser")) this.user.email = "";
      } else {
        if(this.isHotmilk){
          this.$router.push("/login");
        }else {
          this.inForms = true
          this.parte = 1
        }
      }
      const params = this.getParams;
      if (params && params.entidadeId && params.imovelRef) {
        this.user.entidadeId = params.entidadeId;
        this.user.imovelRef = params.imovelRef;
        this.user.validadeInicial = this.login.validadeInicial
          ? this.login.validadeInicial
          : "";
        this.user.validadeFinal = this.login.validadeFinal
          ? this.login.validadeFinal
          : "";
        this.carregarHorarios();
        this.montarQrcode();
        if (this.login.validadeInicial && this.login.validadeFinal) {
          // Pula para preencher o formulário
          this.inForms = true;
          this.parte = 2;
          // Define horário selecionado quando no browser
          const data = moment(this.login.validadeInicial);
          const visita = {
            title: "Horário Selecionado",
            date: data.format("YYYY-MM-DD"),
            time: data.format("HH:mm"),
            duration: this.timeStepMin,
            bgcolor: "green-10",
            textColor: "text-white",
          };
          this.events.push(visita);
          // Limpa a escolha do horário no localstorage para n dar problema nas próximas vezes
          delete this.login.validadeInicial;
          delete this.login.validadeFinal;
          this.$store.dispatch("setarDados", {
            key: "setLogin",
            value: this.login,
          });
        }
      }
      this.semImovel = false;
      if (!params || !params.entidadeId || !params.imovelRef)
        this.semImovel = true;
      this.setHoliday(new Date().getFullYear());
    } catch (e) {
      console.log("Erro ao carregar ", e);
      this.semImovel = true;
    }
    if (this.semImovel) this.$router.push("/hotmilk");
  },
  methods: {
    //verificar créditos retorna false se não tiver créditos
    verificarCreditos(horasMensaisDisponiveis, horasExtras, valor, consumoCreditos) {
      if (horasMensaisDisponiveis + horasExtras < valor * consumoCreditos && this.isHotmilk) {
        Dialog.create({
          title: "Aviso",
          //link ainda não implemenado
          message:
            "<p>Você não possui créditos suficientes</p>" +
            "<a href='#'> Clique aqui para solicitar mais créditos</a>",
          html: true,
          ok: {
            label: "ok",
            color: "positive",
          },
        }).onOk(() => {});
        return false;
      }
      return true;
    },

    async telaInicial() {
      await this.$store.dispatch("setarDados", { key: "setParams", value: {} });
      await this.$store.dispatch("setarDados", { key: "setLogo", value: "" });
      this.semImovel = true;
      this.$router.push(`/${this.routeCoworking}`);
    },

    goBack() {
      this.$router.go(-2);
    },
    async logout(force) {
      if (force) {
        this.user.name = "";
        this.user.empresa = "";
        this.user.phone = "";
        this.user.cpf = "";
        this.user.email = "";
        await this.$store.dispatch("setarDados", {
          key: "setLogin",
          value: [],
        });

        this.$store.dispatch("setarDados", {
          key: "setEstadoInicial",
          value: true,
        });

        this.parte = 1;
        this.$router.go(-2);
        return;
      }
      Dialog.create({
        title: "Aviso",
        message: "Você esta prestes a fazer logout. Você tem certeza?",
        ok: {
          label: "Sim",
          color: "positive",
        },
        cancel: {
          label: "Não",
          color: "negative",
        },
      }).onOk(async () => {
        this.user.name = "";
        this.user.empresa = "";
        this.user.phone = "";
        this.user.cpf = "";
        this.user.email = "";
        await this.$store.dispatch("setarDados", {
          key: "setLogin",
          value: [],
        });
        this.parte = 1;
      });
    },
    montarQrcode() {
      let url = "";
      if (this.user && this.user.entidadeId && this.user.imovelRef) {
        url +=
          "https://agenda.chavi.com.br/" +
          this.user.entidadeId +
          "/" +
          this.user.imovelRef;
      }
      let infos = {};
      if (this.login && this.login.id && this.login.user) {
        infos.id = this.login.id;
        infos.userId = this.login.userId;
        infos.user = {
          nome: this.login.user.nome,
          telefone: this.login.user.telefone,
          email: this.user.email ? this.user.email : this.login.user.email,
          cpf: this.user.cpf ? this.user.cpf : this.login.user.cpf,
          id: this.login.userId,
          fotoSelfie: this.login.user.fotoSelfie,
          fotoFrente: this.login.user.fotoFrente,
          fotoAtras: this.login.user.fotoAtras,
        };
      }
      if (this.user.validadeInicial)
        infos.validadeInicial = this.user.validadeInicial;
      if (this.user.validadeFinal)
        infos.validadeFinal = this.user.validadeFinal;

      if (infos) url += "/?login=" + JSON.stringify(infos);
      try {
        this.qrcode = encodeURI(url);
      } catch {
        this.qrcode = url;
      }
    },
    onTodayMonth() {
      if (!this.$q.platform.is.desktop) this.$refs.calendarMonth.moveToToday();
      else this.$refs.calendar.moveToToday();
    },
    onPrevMonth() {
      if (!this.$q.platform.is.desktop) this.$refs.calendarMonth.prev();
      else this.$refs.calendar.prev();
    },
    onNextMonth() {
      if (!this.$q.platform.is.desktop) this.$refs.calendarMonth.next();
      else this.$refs.calendar.next();
    },
    onClickDate(data) {
      console.log("onMoved", JSON.stringify(data));
    },
    async nextStep() {
      if (!this.$refs.forms.validate()) {
        console.log("cai aqui");
        return;
      }
      const nome = this.isCoworking
        ? this.user.name + " - " + this.user.empresa
        : this.user.name;
      if (
        this.login &&
        this.login.user &&
        (this.login.user.nome != nome ||
          this.user.email != this.login.user.email ||
          this.user.cpf != this.login.user.cpf ||
          this.user.name != this.login.user.nome)
      ) {
        const nome = this.isCoworking
          ? this.user.name + " - " + this.user.empresa
          : this.user.name;
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
      this.montarQrcode();
      console.log("montar qrcode");
      console.log(this.utilizarDocumentos, this.user.hasDocs);

      this.utilizarDocumentos && !this.user.hasDocs
        ? (this.parte += 1)
        : (this.parte += 2);

      console.log("Parte:", this.parte);
    },
    badgeClasses(event, type) {
      const isHeader = type === "header";
      return {
        [`${event.textColor} bg-${event.bgcolor}`]: true,
        "full-width": !isHeader && (!event.side || event.side === "full"),
        "left-side": !isHeader && event.side === "left",
        "right-side": !isHeader && event.side === "right",
        "rounded-border": true,
      };
    },
    badgeStyles(event, timeStartPos, timeDurationHeight) {
      const s = {};
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.time) + "px";
        s.height = timeDurationHeight(event.duration) + "px";
      }
      s["align-items"] = "flex-start";
      return s;
    },

    getEvents(dt) {
      const events = this.eventsMap[dt] || [];
      if (events.length === 1) {
        events[0].side = "full";
      }
      return events;
    },

    qualEvento(informacao, minutos, hora, scope) {
        let informacaoM = informacao.charAt(0).toUpperCase() + informacao.slice(1)
        Dialog.create({
          title: informacaoM,
          message:`
                    <div style="margin-bottom: 10px;">
                      <textarea name="textarea" style="width:100%;height:150px; border: none; background-color: lightgrey;" id="texto" placeholder="Descreva aqui"></textarea>
                    </div>
                    <div>
                      <input type="checkbox" id="checkbox"/>
                      <label for="checkbox">Públoco externo</label>
                    </div>`,
        html : true,
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          let texto = document.getElementById("texto").value
          this.publicoExterno = document.getElementById("checkbox").checked
          this.eventoOutros = { label: informacao, value: texto };
          this.escolherHorario(minutos, hora, scope);
      });
      if (this.eventoOutros.length > 0) this.eventoOutros = [];
    },
    quantasPessoas() {
      Dialog.create({
        title:
          '<span style="font-size: 1.2rem" class="text-primary">Aviso</span>',
        message: `
              <span>
                Informe o número de pessoas externas a hotmilk que irão utilizar o espaço. <br/>
                Insira 0 (zero) caso não haja participantes externos.
              </span>
            `,
        prompt: {
          model: 0,
          type: "number",
        },
        ok: {
          label: "Continuar",
          color: "positive",
          flat: true,
        },
        cancel: {
          label: "Escolher outro horário",
          color: "primary",
          flat: true,
        },
        html: true,
      })
        .onOk((res) => {
          Loading.show();
          setTimeout(() => {
            if (res > this.maximoPessoas + 1) {
              Notify.create({
                message: "Mais pessoas que a capacidade da sala",
                type: "warning",
              });
            }
            this.inForms = true;
            if (res > this.$store.imovelAgeda) {
              this.numeroVisitantesExternos = res;
            }

            if (this.login && this.login.id && this.login.user) {
              this.entidadeUsuario = this.login.user.entidade.id;
              if (
                !this.utilizarEmail &&
                !this.utilizarDocumentos &&
                !this.utilizarCPF &&
                (this.isCoworking
                  ? this.user.empresa && this.user.empresa != ""
                  : true)
              )
                this.parte = 4;
              else this.parte = 2;
            }
            Loading.hide();
          }, 1500);
        })
        .onCancel(() => {
          this.events.pop();
        });
    },

    async escolherHorario(minutos, hora, scope) {
      //aqui começa a parte de escolher horário
      let horasMensaisDisponiveis = 0;
      let horasExtras = 0;
      let consumoDeCreditos = 1;

      if (this.entidadeUsuario) {
        let request = {
          url: `entidades/gerenciamentoDeHoras/${this.entidadeUsuario}/${this.idImovel}`,
          method: "get",
        };
        const response = await this.executeMethod(request, false);


        horasMensaisDisponiveis = response.data.horasMensaisDisponiveis;
        horasExtras = response.data.horasExtras;
        consumoDeCreditos = response.data.consumoCreditos;
      }

      if (this.timeStepMin == 15) {
        if (minutos > 45) minutos = 60;
        else if (minutos > 30) minutos = 45;
        else if (minutos > 15) minutos = 30;
        else minutos = 15;
      }

      if (this.timeStepMin == 30) {
        if (minutos > 30) minutos = 60;
        else minutos = 30;
      }

      if (this.timeStepMin == 60) minutos = 60;

      const horario =
        hora.toString() +
        ":" +
        (minutos - this.timeStepMin == 0
          ? "00"
          : minutos - this.timeStepMin
        ).toString();

      if (minutos == 60) hora = parseInt(hora) + 1;

      const options = this.isHotmilk ? 
      [
        { label: "45 minutos", value: "45" },
        { label: "1 hora", value: "60" },
        { label: "1:30 hora", value: "90" },
        { label: "2 horas", value: "120" },
        { label: "2:30 horas", value: "150" },
        { label: "3 horas", value: "180" },
        { label: "4 horas", value: "240" },
        { label: "5 horas", value: "300" },
        { label: "6 horas", value: "360" },
      ]        : [
        { label: "30 minutos", value: "30" },
        { label: "45 minutos", value: "45" },
        { label: "1 hora", value: "60" },
        { label: "1:30 hora", value: "90" },
        { label: "2 horas", value: "120" },
        { label: "2:30 horas", value: "150" },
        { label: "3 horas", value: "180" },
        { label: "4 horas", value: "240" },
        { label: "5 horas", value: "300" },
        { label: "6 horas", value: "360" },
      ];

      const inicial = options.find((item) => {
        return item.value == this.timeStepMin;
      });

      const itens = inicial ? [] : this.isHotmilk ? [{ label: "30 minutos", value: "30" }] : [{ label: "15 minutos", value: "15" }];

      const filter = options.filter((item) => {
        return parseInt(item.value) <= this.tempoMaximo;
      });
      const date = scope.timestamp.date;

      const dateTime = new Date(
        (date + " " + horario).replace(/\-/g, "/")
      ).getTime();

      for (const opt of filter) {
        const inteiro = parseInt(opt.value) % parseInt(this.timeStepMin) == 0;
        const ms = parseInt(opt.value) * 60 * 1000;

        const eventFilter = this.events.find((item) => {
          return item.timestampInicial > dateTime;
        });

        if (eventFilter) {
          const dateTimeFinal = dateTime + ms;

          if (eventFilter.timestampInicial >= dateTimeFinal && inteiro)
            itens.push(opt);
        } else if (inteiro) itens.push(opt);
      }

      if (!consumoDeCreditos) consumoDeCreditos = 1;
      itens.forEach((element) => {
        let value = element.label.split(" ")[0];
        const time = element.label.split(" ")[1];
          element.label = `${element.label}`;
      });

      Dialog.create({
        title: `<center><span class='text-primary text-bold'>Agendamento</span></center>`,
        message: `<span class='text-black' style='font-size: 1rem'>
            <center>Selecione a duração da sua utilização</center>
          </span>
          ${
            this.tempoMinimoAprovacao != 0 && this.aprovarVisita
              ? `<br/> <span style='font-size: 0.8rem'> Acima de ${this.tempoMinimoAprovacaoLabel} os agendamentos estão sugeitos a aprovação. </span>`
              : !this.aprovarVisita
              ? "<br/> <span style='font-size: 0.8rem'> O agendamento está sujeito à ser aprovados. </span>"
              : ""
          }
          `,
        options: {
          type: "radio",
          model: this.duracao,
          items: itens,
        },
        ok: {
          flat: true,
          color: "positive",
          label: "Confirmar",
        },
        cancel: {
          flat: true,
          label: "Escolher outro",
        },
        html: true,
        persistent: true,
      }).onOk((data) => {
        if (
          !this.verificarCreditos(
            horasMensaisDisponiveis,
            horasExtras,
            parseInt(data),
            consumoDeCreditos
          ) && this.isHotmilk
        ) {
          return;
        }
        const visita = {
          title: "Horário Selecionado",
          date: scope.timestamp.date,
          time: horario,
          duration: parseInt(data),
          bgcolor: "green-10",
          textColor: "text-white",
        };
        this.events.push(visita);
        const validadeInicial = new Date(
          (scope.timestamp.date + " " + horario).replace(/\-/g, "/")
        ).getTime();
        this.user.validadeInicial = validadeInicial;
        this.user.validadeFinal = validadeInicial + parseInt(data) * 60000;
        this.montarQrcode();

        if (this.habilitarPublicoExterno) {
          this.quantasPessoas();
        } else {
          Loading.show();
          setTimeout(() => {
            this.inForms = true;
            if (this.login && this.login.id && this.login.user) {
              if (
                !this.utilizarEmail &&
                !this.utilizarDocumentos &&
                !this.utilizarCPF
              )
                this.parte = 4;
              else this.parte = 2;
            }
            Loading.hide();
          }, 1500);
        }
      });
    },
    //Modal gigante que chama outras modais - verifica tipo de evento, tempo de uso, pessoas externas
    async onTimeClick({ event, scope }) {
      let hora = scope.timestamp.hour;
      let minutos = scope.timestamp.minute;
      const dia = moment(scope.timestamp.date);
      const now = moment();

      this.entidadeUsuario = this.getLogin.user.entidadeId;

      if (this.contador == 0) {
        let obj = { ...this.imovel.opcoesDeCredito.tipoEvento };
        const trueKeys = [];
        for (const key in obj) {
          if (obj[key]) {
            let keyLabel = key.toString();
            keyLabel = keyLabel.charAt(0).toUpperCase() + keyLabel.slice(1);
            if (keyLabel == "Reuniao") keyLabel = "Reunião";
            trueKeys.push({ label: keyLabel, value: `${key}` });
          }
        }

        //verifica se o horário esta certo para criar visita
        const now_vector = now.format("MM DD HH mm").split(" ");
        const minutes_base_ref = now
          .subtract(this.timeStepMin, "minutes")
          .format("mm");
        if (scope.timestamp.past) {
          if (
            !(
              dia == parseInt(now_vector[1]) &&
              hora == parseInt(now_vector[2]) &&
              minutos < parseInt(now_vector[3]) &&
              minutos > parseInt(minutes_base_ref)
            )
          ) {
            Dialog.create({
              title:
                "<span class='text-primary' style='font-size: 1.4rem'>Aviso</span>",
              message:
                "<span style='font-size: 1.0rem' class='text-black'>Por favor, selecione um horário futuro.</span>",
              html: true,
              ok: "Ok",
            });
            return;
          }
        }

        let diaFuturo = now.add(this.liberarAgendamento, "day");

        if (this.liberarAgendamento > -1 && dia > diaFuturo) {
          Dialog.create({
            title:
              "<span class='text-primary' style='font-size: 1.4rem'>Aviso</span>",
            message:
              "<span style='font-size: 1.0rem' class='text-black'>Horário não liberado para agendamento. Por gentileza, selecione outro horário.</span>",
            html: true,
            ok: "Ok",
          });
          return;
        }
        //tipo de evento - outros chama outra modal que pede o que é
        await new Promise((resolve, reject) => {
          Dialog.create({
            title: "Tipo de evento",
            message: "Escolha o tipo de evento:",
            options: {
              type: "radio",
              model: "",
              items: trueKeys,
            },
            cancel: true,
            persistent: true,
          })
            .onOk((data) => {
              const filtro = ["outros", "evento"];
              if (filtro.includes(data)) {
                this.qualEvento(data, minutos, hora, scope);
                
              } else {
                this.eventoOutros.push(data);
                this.escolherHorario(minutos, hora, scope);
              }
              resolve();
            })
            .onCancel(() => {
              this.contador = 0;
              reject();
            })
            .onDismiss(() => {
              reject();
            });
        });
      }
    },
    filtraValor(valorDaSala) {
      if (valorDaSala) {
        let filtroValorDaSala = valorDaSala.toString();
        if (filtroValorDaSala.length == 1 || filtroValorDaSala.length == 2) {
          return `${valorDaSala}.00`;
        }
      }

      let valor =
        this.valorDaSala *
        (this.diferencaEmMinutos(
          this.user.validadeInicial,
          this.user.validadeFinal
        ) /
          15);
      let filtro = valor.toString();

      if (filtro.length == 1 || filtro.length == 2) {
        filtro = `${filtro}.00`;
      }

      if (filtro.length == 3 && filtro[2] !== ".") {
        filtro = `${filtro}.00`;
      }
      return filtro;
    },
    //não existe nescessita pagamento - Verficar se é pra tirar
    async onSubmit() {
      if (this.necessitaPagamento) {
        this.checkoutPagamento();
        return;
      }

      if (
        this.fotoFrente &&
        this.fotoFrente.length &&
        this.fotoFrente.length == 0
      ) {
        Notify.create({
          message: "Insira a foto da frente do seu documento",
          type: "warning",
        });
        return;
      }

      if (
        this.fotoVerso &&
        this.fotoVerso.length &&
        this.fotoVerso.length == 0
      ) {
        Notify.create({
          message: "Insira a foto do verso do seu documento",
          type: "warning",
        });
        return;
      }

      if (
        this.fotoSelfie &&
        this.fotoSelfie.length &&
        this.fotoSelfie.length == 0
      ) {
        Notify.create({ message: "Insira uma selfie sua", type: "warning" });
        return;
      }

      if (!this.user.terms) {
        Notify.create({
          message: "Para prosseguir, aceite os termos de uso e privacidade",
          type: "warning",
        });
        return;
      }
      if (!this.user.use) {
        Notify.create({
          message: "Para prosseguir, aceite os termos de utilização da sala",
          type: "warning",
        });
        return;
      }
      Loading.show({ message: "Gerando a visita..." });
      this.user.numeroVisitantesExternos = parseInt(
        this.numeroVisitantesExternos
      );

      let user = {
        ...this.user,
      };

      if (this.necessitaAprovacao) {
        user.necessitaAprovacao = true;
      }

      if (this.whatsappAvisoAgendamento) {
        user.whatsappAvisoAgendamento = this.whatsappAvisoAgendamento;
      }

      if (this.emailAvisoAgendamento) {
        user.emailAvisoAgendamento = this.emailAvisoAgendamento;
      }

      if (this.eventoOutros) {
        user.eventoOutros = this.eventoOutros;
      }

      let request = {
        url: "Visitas/validarVisita",
        method: "post",
        data: user,
      };

      this.user.paraAprovar =
        this.user.validadeFinal - this.user.validadeInicial >= 60000 * 120;
      if (!this.user.hasDocs) {

        this.user.fotoFrente = await this.compressImage(this.fotoFrente);
        this.user.fotoAtras = await this.compressImage(this.fotoVerso);
        this.user.fotoSelfie = await this.compressImage(this.fotoSelfie);

        const blobFrente = {
          blob: new Blob([this.user.fotoFrente]),
          name: this.user.fotoFrente.name,
        };
        const blobAtras = {
          blob: new Blob([this.user.fotoAtras]),
          name: this.user.fotoAtras.name,
        };
        const blobSelfie = {
          blob: new Blob([this.user.fotoSelfie]),
          name: this.user.fotoSelfie.name,
        };

        let formData = new FormData();
        Object.keys(user).forEach((key) => formData.append(key, user[key]));
        formData.append("fotoFrente", blobFrente.blob, blobFrente.name);
        formData.append("fotoAtras", blobAtras.blob, blobAtras.name);
        formData.append("fotoSelfie", blobSelfie.blob, blobSelfie.name);

        request.headers = { "Content-Type": "multipart/form-data" };
        request.data = formData;
      }
      const response = await this.executeMethod(request, false);
      Loading.hide();

      if (response && response.status == 200) {
        const message = response.data.text;
        if (
          response.data.responseWpp &&
          response.data.responseWpp.statusCode &&
          response.data.responseWpp.statusCode != 200
        ) {
          Notify.create({
            message:
              "Algo inesperado aconteceu, não foi possível enviar mensagem via Whats App.",
          });
        }
        const dialog = {
          title:
            '<span class="text-primary" style="font-size:1.2rem">Finalizada</span>',
          message: '<span style="font-size:1.0rem"> ' + message + " </span>",
          ok: "Entendido",
          html: true,
          persistent: true,
        };
        if (response.data.ics) dialog.cancel = "Salvar no calendário";
        Dialog.create(dialog)
          .onOk(() => {
            this.$store.dispatch("setarDados", { key: "setParams", value: {} });
            this.$store.dispatch("setarDados", { key: "setLogo", value: "" });
            this.semImovel = true;
            this.openURL("https://agenda.chavi.com.br/hotmilk", "_self");
            if (response.data && response.data.url)
              this.openURL(response.data.url, "_self");
          })
          .onCancel(async () => {
            const ics = response.data.ics;
            window.open(
              `${process.env.VUE_APP_API_URL}/StorageContainers/ics/download/${ics}`,
              "_system"
            );
            Dialog.create({
              title:
                '<span class="text-primary" style="font-size:1.2rem">Download do agendamento sendo feito</span>',
              message:
                '<span style="font-size:1.0rem">Após o download, abra o arquivo para marcar o agendamento em sua agenda</span>',
              ok: "Abrir visita",
              persistent: true,
              html: true,
            }).onOk(() => {
              this.$store.dispatch("setarDados", {
                key: "setParams",
                value: {},
              });
              this.$store.dispatch("setarDados", { key: "setLogo", value: "" });
              this.semImovel = true;
              if (response.data && response.data.url)
                this.openURL(response.data.url, "_self");
              else this.openURL("https://agenda.chavi.com.br/hotmilk", "_self");
            });
          });
      } else if (response && response.status) {
        const message = response.data
          ? response.data.message
          : response.message
          ? response.message
          : "";
        Dialog.create({
          title:
            '<span class="text-primary" style="font-size:1.2rem">Aconteceu algo inesperado!</span>',
          message:
            '<span style="font-size:1.0rem"> ' +
            message +
            "<br/> Revise os dados e tente novamente. </span>",
          ok: "Entendido",
          html: true,
        });
      }
    },

    async checkoutPagamento() {
      const data = {
        sala: this.user.imovelRef,
        tempoDeUso: this.diferencaEmMinutos(
          this.user.validadeInicial,
          this.user.validadeFinal
        ),
        preco:
          this.valorDaSala *
          (this.diferencaEmMinutos(
            this.user.validadeInicial,
            this.user.validadeFinal
          ) /
            15),
      };

      let request = {
        url: "Entidades/checkoutPagamento",
        method: "post",
        data: data,
      };

      const response = await this.executeMethod(request, false);
      this.user.entidadeUsuario = this.entidadeUsuario;

      this.$store.dispatch("setarDados", {
        key: "setConvite",
        value: this.user,
      });

      const mp = new MercadoPago(this.chaveAgendamento, {
        locale: "pt-BR",
      });
      mp.checkout({
        preference: {
          id: response.data,
        },
        render: {
          container: ".cho-container",
          label: "Efetuar pagamento",
        },
        autoOpen: true,
      });
      return;
    },
    diferencaEmMinutos(inicial, final) {
      const dataInicio = moment(inicial);
      const dataFim = moment(final);

      const calcula = dataFim.diff(dataInicio, "minutes");

      return calcula;
    },

    openURL(link, target) {
      window.open(link, target);
    },
    onReset() {
      this.user.name = "";
      this.user.empresa = "";
      this.user.cpf = "";
      this.user.email = "";
    },
    onValError(ref) {
      this.parte = 2;
    },
    verificarEmail(valor) {
      const regexp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?/i;
      const regexp2 = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
      return regexp.test(valor) || regexp2.test(valor) || !this.utilizarEmail;
    },
    verificarCPF(valor) {
      if (valor) {
        var soma;
        var resto;
        soma = 0;
        const cpf = valor.toString().replace(/\.|\-/g, "");
        if (cpf == "00000000000") return false;

        for (let i = 1; i <= 9; i++)
          soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++)
          soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;
        return true;
      }
    },
    async carregarHorarios() {
      try {
        Loading.show({
          message: "Carregando dados",
        });
        const cliente = this.user.entidadeId;
        const imovel = this.user.imovelRef;
        if (cliente) {
          const response = await this.executeMethod({
            url: "Visitas/horariosOcupados",
            method: "GET",
            params: {
              clienteId: cliente,
              imovelRef: imovel,
            },
          });
          if (response && response.status == 200) {
            this.cliente = response.data.entidade;

            this.idImovel = response.data.idImovel;
            this.imovel = response.data.imovel;
            this.$store.dispatch("setarDados", {
              key: "setLogo",
              value: this.cliente.logo,
            });
            //Verifica se a sala necessita aprovacao
            response.data.entidade.preferenciaVisita.necessitaAprovacao
              ? (this.necessitaAprovacao = true)
              : (this.necessitaAprovacao = false);

            response.data.entidade.preferenciaVisita.necessitaPagamento
              ? (this.necessitaPagamento = true)
              : (this.necessitaPagamento = false);

            response.data.entidade.preferenciaVisita.whatsappAvisoAgendamento
              ? (this.whatsappAvisoAgendamento =
                  response.data.entidade.preferenciaVisita.whatsappAvisoAgendamento)
              : (this.whatsappAvisoAgendamento = "");

            response.data.entidade.preferenciaVisita.emailAvisoAgendamento
              ? (this.emailAvisoAgendamento =
                  response.data.entidade.preferenciaVisita.emailAvisoAgendamento)
              : (this.emailAvisoAgendamento = "");

            response.data.entidade.preferenciaVisita.chaveAgendamento
              ? (this.chaveAgendamento =
                  response.data.entidade.preferenciaVisita.chaveAgendamento)
              : (this.chaveAgendamento = "");

            response.data.entidade.preferenciaVisita.valorDaSala
              ? (this.valorDaSala =
                  response.data.entidade.preferenciaVisita.valorDaSala)
              : (this.valorDaSala = 0);

            if (this.cliente && this.cliente.preferenciaUsuario) {
              this.utilizarCPF = this.cliente.preferenciaUsuario.utilizarCPF;
              this.utilizarDocumentos =
                this.cliente.preferenciaUsuario.utilizarDocumentos;
              this.verificarDocumentos =
                this.cliente.preferenciaUsuario.verificarDocumentos;
              this.utilizarEmail =
                this.cliente.preferenciaUsuario.utilizarEmail;
              this.loginEmail = this.cliente.preferenciaUsuario.loginEmail;
              this.aprovarVisita =
                this.cliente.preferenciaUsuario.aprovarVisita;
            }
            if (this.cliente && this.cliente.preferenciaVisita) {
              this.tempoMinimoAprovacao = this.cliente.preferenciaVisita
                .tempoMinimoAprovacao
                ? this.cliente.preferenciaVisita.tempoMinimoAprovacao
                : 0;
              this.tempoMaximo = this.cliente.preferenciaVisita.tempoMaximo
                ? this.cliente.preferenciaVisita.tempoMaximo
                : 60;
              this.isCoworking = this.cliente.preferenciaVisita.coworking
                ? this.cliente.preferenciaVisita.coworking
                : false;
              this.sabado = this.cliente.preferenciaVisita.sabado
                ? true
                : false;
              this.liberarFeriado = this.cliente.preferenciaVisita.feriado;
              this.domingo = this.cliente.preferenciaVisita.domingo
                ? true
                : false;

              if (this.cliente.preferenciaVisita.intervaloMin) {
                this.timeStepMin = this.cliente.preferenciaVisita.intervaloMin;
                this.duracao =
                  this.cliente.preferenciaVisita.intervaloMin.toString();
              }
              if (this.cliente.preferenciaVisita.horaInicial) {
                this.horaInicial = this.cliente.preferenciaVisita.horaInicial
                  .toString()
                  .split(":")[0];
              }
              if (this.cliente.preferenciaVisita.horaFinal) {
                this.horaFinal = this.cliente.preferenciaVisita.horaFinal
                  .toString()
                  .split(":")[0];
              }
              if (this.cliente.preferenciaVisita.liberarAgendamento) {
                this.liberarAgendamento = this.cliente.preferenciaVisita
                  .liberarAgendamento
                  ? this.cliente.preferenciaVisita.liberarAgendamento
                  : -1;
              }
              this.habilitarPublicoExterno = this.cliente.preferenciaVisita
                .habilitarPublicoExterno
                ? this.cliente.preferenciaVisita.habilitarPublicoExterno
                : false;
            }
            this.events = response.data.horarios;
            this.formatData();
          } else {
            Notify.create({
              message:
                "Não foi possível localizar o imóvel ou sala em questão. Verifique o seu link de acesso e tente novamente",
              type: "warning",
            });
            this.semImovel = true;
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        Loading.hide();
      }
    },
    formatData() {
      if (this.events && this.events.length > 0) {
        this.events.sort((a, b) => {
          return a.timestampInicial < b.timestampInicial ? -1 : 1;
        });
        let optionsOff = [];
        for (let horario of this.events) {
          if (!horario.paraAprovar) {
            const inicio = parseTimestamp(
              moment(parseInt(horario.timestampInicial)).format(
                "YYYY-MM-DD HH:mm"
              )
            );
            const duracao = horario.intervalo / 60000;
            const titleBusy = horario.usuario
              ? `
                <div class="column justify-center text-center align-center" style="white-space: pre-wrap">
                  <div class="full-width text-center">Ocupado</div>
                  <div class="full-width text-center">${
                    horario.usuario.indexOf("-") == -1
                      ? horario.usuario.trim()
                      : `${horario.usuario.split("-")[0].trim()}<br/>${
                          horario.usuario.split("-")[1]
                            ? horario.usuario.split("-")[1].trim()
                            : ""
                        }`
                  }</div>
                </div>
              `
              : "Ocupado";
            optionsOff.push({
              title: horario.paraAprovar ? "Pendente" : titleBusy,
              date: inicio.date,
              time: inicio.time,
              duration: duracao,
              bgcolor: horario.paraAprovar ? "blue-9" : "red-5",
              textColor: "text-white",
              timestampInicial: horario.timestampInicial,
            });
          }
        }
        this.events = optionsOff;
      }
    },
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
      const nome = this.isCoworking
        ? this.user.name + " - " + this.user.empresa
        : this.user.name;
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
          inForms = false;
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
        if (this.user.validadeInicial) this.parte += 1;
        else this.inForms = false;
        if (!this.utilizarEmail && !this.utilizarDocumentos) this.nextStep();
      } else {
        Notify.create({
          message: "Número de Telefone inválido ou Código SMS incorreto.",
          type: "warning",
        });
      }
    },
    async criarVisita() {
      let user = {
        ...this.user,
      };

      if (!this.user.hasDocs) {
        this.user.fotoFrente = await this.compressImage(this.fotoFrente);
        this.user.fotoAtras = await this.compressImage(this.fotoVerso);
        this.user.fotoSelfie = await this.compressImage(this.fotoSelfie);

        const blobFrente = {
          blob: new Blob([this.user.fotoFrente]),
          name: this.user.fotoFrente.name,
        };
        const blobAtras = {
          blob: new Blob([this.user.fotoAtras]),
          name: this.user.fotoAtras.name,
        };
        const blobSelfie = {
          blob: new Blob([this.user.fotoSelfie]),
          name: this.user.fotoSelfie.name,
        };

        let formData = new FormData();
        Object.keys(user).forEach((key) => formData.append(key, user[key]));
        formData.append("fotoFrente", blobFrente.blob, blobFrente.name);
        formData.append("fotoAtras", blobAtras.blob, blobAtras.name);
        formData.append("fotoSelfie", blobSelfie.blob, blobSelfie.name);

        request.headers = { "Content-Type": "multipart/form-data" };
        request.data = formData;
      }

      return user;
    },

    getDayOfWeek(dow) {
      switch (dow) {
        case 0:
          return "Domingo";
        case 1:
          return "Segunda-Feira";
        case 2:
          return "Terça-Feira";
        case 3:
          return "Quarta-Feira";
        case 4:
          return "Quinta-Feira";
        case 5:
          return "Sexta-Feira";
        case 6:
          return "Sábado";
        default:
          return "";
      }
    },

    setHoliday(y) {
      function easterDay(y) {
        var c = Math.floor(y / 100);
        var n = y - 19 * Math.floor(y / 19);
        var k = Math.floor((c - 17) / 25);
        var i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
        i = i - 30 * Math.floor(i / 30);
        i =
          i -
          Math.floor(i / 28) *
            (1 -
              Math.floor(i / 28) *
                Math.floor(29 / (i + 1)) *
                Math.floor((21 - n) / 11));
        var j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
        j = j - 7 * Math.floor(j / 7);
        var l = i - j;
        var m = 3 + Math.floor((l + 40) / 44);
        var d = l + 28 - 31 * Math.floor(m / 4);
        return moment([y, m - 1, d]);
      }
      var anoNovo = moment("01/01/" + y, "DD/MM/YYYY");
      var carnaval1 = easterDay(y).add(-48, "d");
      var carnaval2 = easterDay(y).add(-47, "d");
      var paixaoCristo = easterDay(y).add(-2, "d");
      var pascoa = easterDay(y);
      var tiradentes = moment("21/04/" + y, "DD/MM/YYYY");
      var corpusChristi = easterDay(y).add(60, "d");
      var diaTrabalho = moment("01/05/" + y, "DD/MM/YYYY");
      var diaIndependencia = moment("07/09/" + y, "DD/MM/YYYY");
      var nossaSenhora = moment("12/10/" + y, "DD/MM/YYYY");
      var finados = moment("02/11/" + y, "DD/MM/YYYY");
      var proclamaRepublica = moment("15/11/" + y, "DD/MM/YYYY");
      var natal = moment("25/12/" + y, "DD/MM/YYYY");
      this.holidays = [
        { m: anoNovo, dia: "Ano Novo", d: anoNovo.format("DD/MM/YYYY") },
        { m: carnaval1, dia: "Carnaval", d: carnaval1.format("DD/MM/YYYY") },
        { m: carnaval2, dia: "Carnaval", d: carnaval2.format("DD/MM/YYYY") },
        {
          m: paixaoCristo,
          dia: "Paix\u00E3o de Cristo",
          d: paixaoCristo.format("DD/MM/YYYY"),
        },
        { m: pascoa, dia: "P\u00E1scoa", d: pascoa.format("DD/MM/YYYY") },
        {
          m: tiradentes,
          dia: "Tiradentes",
          d: tiradentes.format("DD/MM/YYYY"),
        },
        {
          m: corpusChristi,
          dia: "Corpus Christi",
          d: corpusChristi.format("DD/MM/YYYY"),
        },
        {
          m: diaTrabalho,
          dia: "Dia do Trabalho",
          d: diaTrabalho.format("DD/MM/YYYY"),
        },
        {
          m: diaIndependencia,
          dia: "Dia da Independ\u00EAncia do Brasil",
          d: diaIndependencia.format("DD/MM/YYYY"),
        },
        {
          m: nossaSenhora,
          dia: "Nossa Senhora Aparecida",
          d: nossaSenhora.format("DD/MM/YYYY"),
        },
        { m: finados, dia: "Finados", d: finados.format("DD/MM/YYYY") },
        {
          m: proclamaRepublica,
          dia: "Proclama\u00E7\u00E3o da Rep\u00FAblica",
          d: proclamaRepublica.format("DD/MM/YYYY"),
        },
        { m: natal, dia: "Natal", d: natal.format("DD/MM/YYYY") },
      ];
    },

    getHoliday(date) {
      date = moment(date).format("DD/MM/YYYY");
      const filter = this.holidays.filter((holiday) => {
        return holiday.d == date;
      });
      return filter;
    },

    termosDeUso() {
      Dialog.create({
        title: "Termos de uso da sala",
        message:
          "Agende as salas somente quando<strong> necessário</strong>, não utilize apenas para trabalhar em um ambiente isolado.<br> Reservou a sala e <strong>não vai mais utilizar?</strong> <strong>Cancele sua reserva</strong> dentro do link que você recebeu em seu telefone, pois outras pessoas podem estar precisando da reserva.<br><br>      • <strong>Não extrapole</strong> o seu horário de reserva; <br>      • <strong>Desligue</strong> os equipamentos e as luzes;<br>      • Mantenha o ambiente <strong>organizado</strong> da mesma forma que encontrou ao chegar;<br>      • Não se esqueça de <strong>jogar fora</strong> os copinhos de água ou café.",
        html: true,
        fullWidth: true,
        ok: {
          label: "Ok",
          color: "positive",
        },
      });
    },
  },
});
</script>

<style scoped>
@media (max-width: 450px) {
  .home-icon {
    display: none;
  }
}

.home-icon {
  position: fixed;
  transform: scale(1.6);
  z-index: 9999999;
  left: 20px;
  top: 20px;
}

.descritivo {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 400px;
  max-height: 130px;
  background-color: white;
  border-radius: 8px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  color: #505050;
  justify-content: center;
}

.descritivo-title {
  width: 100%;
  padding-top: 4px;
  padding-bottom: -4px;
  height: 40px;
  text-align: center;
  align-items: center;
}

.descritivo-title > p {
  margin: 0;
}
.descritivo > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.new-div {
  display: flex;
  justify-content: center;
}
.descritivo > div > li {
  padding-left: 10px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.descrt {
  position: relative;
  left: -10px;
}
.title-modal {
  color: #e86628;
}

.btn-modal {
  color: #21ba45;
  border: 1px solid #21ba45;
  border-radius: 4px;
}

.content-modal {
  font-weight: bold;
}

.my-event {
  position: absolute;
  font-size: 12px;
  justify-content: center;
  margin: 0 1px;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}
.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.fakelink {
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}

.bar {
  height: 40px;
  width: 2px;
  margin: 5px;
  background-color: black;
}
.margin-bt{
  margin-bottom: 10px;
}
@media (max-width: 520px) {
  .img-salas {
    width: 100vw;
  }
}
.img-salas {
    margin-top: 15px;
    width: 100%;
    height: 20vh;
    position: center;
    object-fit: contain;
  }
@font-face {
  font-family: 'igualfina';
  src: url('../../public/fonts/Igual/Igual-Regular.otf') format('truetype');
  font-style: normal;
}
@font-face {
  font-family: 'igualnegrito';
  src: url('../../public/fonts/Igual/Igual-ExtraBold.otf') format('truetype');
  font-style: normal;  
}
</style>
