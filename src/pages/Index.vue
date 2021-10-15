<template>
  <q-page class="flex-center column">
    <div class="text-center q-my-lg" style="width: 70vw">
      <div v-if="inForms">
        <span style="font-size: 1.4rem" v-if="parte == 1">
          Por segundo, insira seu nome e telefone.<br />
          Em seguida, aguarde receber o códgio SMS e insira no campo indicado.
        </span>
        <span style="font-size: 1.4rem" v-if="parte == 2">
          Agora, preencha o formulário solicitando visita ao imóvel
          {{ user && user.imovelRef ? user.imovelRef : "" }} da imobiliária
          {{ cliente && cliente.nome ? cliente.nome : "" }}.<br />
          {{
            isRegistredUser
              ? "Caso tenha algum campo faltando, por favor, preencha-o"
              : ""
          }}
        </span>
        <div v-if="parte == 3">
          <span style="font-size: 1.4rem">Estamos quase finalizando.</span
          ><br />
          <span style="font-size: 1.1rem"
            >Para aumentarmos a segurança da sua visita, precisamos que valide
            seu documento de identificação (RG ou CNH)</span
          >
        </div>
        <div v-if="parte == 4">
          <span style="font-size: 1.4rem" class="text-primary">Pronto!</span
          ><br />
          <span style="font-size: 1.2rem"
            >Agora é só revisar os dados e enviar a solicitação de
            agendamento.</span
          >
        </div>
      </div>
      <div v-else>
        <span style="font-size: 1.4rem">
          Primeiro, selecione o melhor dia para você visitar o imóvel
          {{ user.imovelRef }}.
        </span>
      </div>
    </div>
    <div class="full-width" v-if="!inForms">
      <div class="row justify-center items-center">
        <navigation-bar
          @today="calendarToday"
          @prev="calendarPrev"
          @next="calendarNext"
        />
      </div>
      <div class="flex flex-center q-pa-md">
        <div style="width: 80%">
          <q-calendar
            ref="calendar"
            weekday-align="left"
            view="day"
            locale="pt-br"
            style="width: 100%"
            cell-height="100px"
            :weekdays="getWeekDisplay"
            :hoverable="true"
            :interval-minutes="timeStepMin"
            :interval-start="intervalStart"
            :interval-count="intervalCount"
            :disabled-before="disabledBefore"
            bordered
            no-active-date
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
                      {{ event.title }}
                      <q-tooltip>{{ event.time }}</q-tooltip>
                    </div>
                  </div>
                </template>
                <template
                  v-for="(holiday, index) in getHoliday(timestamp.date)"
                  :key="index"
                >
                  <div
                    v-if="holiday && feriado"
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
      style="width: 90vw; max-width: 400px"
    >
      <div v-show="parte == 1" class="full-width">
        <q-input
          class="parte1 full-width text-h5"
          label-color="primary"
          style="font-size: 1.2rem"
          v-model="user.name"
          label="Seu nome *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Insira um nome']"
        />
        <q-input
          class="parte1 full-width"
          type="tel"
          label-color="primary"
          style="font-size: 1.2rem"
          v-model="user.phone"
          label="Seu Telefone *"
          hint="(41) 98888-8888"
          lazy-rules
          :mask="phoneMask"
          :debounce="1000"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Por favor, insira seu telefone.',
            (val) =>
              (val && val.length == 15) ||
              'Por favor, insira seu telefone no formato (41) 91122-3344.',
          ]"
        />
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
              (val !== null && val !== '') || 'Por favor, insira seu códgio.',
            (val) =>
              (val && val.length == 6) ||
              'Por favor, insira seu código corretamente.',
          ]"
        />
        <q-btn-group push flat unelevated class="full-width row q-mt-md">
          <q-btn
            class="col-12"
            :label="codeSent ? 'Verificar Telefone' : 'Enviar Códgio'"
            color="positive"
            @click="!codeSent ? sendPhone() : checkCodigo()"
          />
        </q-btn-group>
      </div>
      <div v-show="parte == 2" class="full-width">
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
          readonly
          clearable
          :debounce="1000"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Por favor, insira seu telefone.',
            (val) =>
              (val && val.length == 15) ||
              'Por favor, insira seu telefone no formato desejado.',
          ]"
        />
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
        <q-input
          class="parte1 full-width"
          type="tel"
          v-model="user.cpf"
          label-color="primary"
          style="font-size: 1.2rem"
          label="Seu CPF *"
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
        <q-input
          class="parte1 full-width"
          type="email"
          v-model="user.email"
          label-color="primary"
          style="font-size: 1.2rem"
          label="Seu E-mail *"
          lazy-rules
          clearable
          :debounce="1000"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Por favor, insira seu E-mail.',
            (val) => verificarEmail(val) || 'Insira um e-mail válido',
          ]"
        />
        <div class="full-width q-mt-xl">
          <q-btn-group push flat class="row full-width justify-center q-mb-xs">
            <q-btn
              class="col-10"
              style="font-size: 0.7rem"
              label="Escolher outro horário"
              outline
              color="primary"
              @click="
                inForms = false;
                events.pop();
              "
            />
          </q-btn-group>
          <q-btn-group push flat unelevated class="full-width row">
            <q-btn
              outline
              label="Limpar"
              type="reset"
              color="secondary"
              class="q-mr-xs col-6"
            />
            <q-btn
              class="col-6 q-ml-xs"
              label="Próximo"
              color="positive"
              @click="nextStep()"
            />
          </q-btn-group>
        </div>
      </div>
      <div v-show="parte == 3 && utilizarDocumentos" class="full-width q-mt-lg">
        <div class="full-width">
          <div class="full-width text-center" style="font-size: 1.1rem">
            <span
              ><strong>Primeiro</strong>, tire ou selecione uma
              <strong>foto frontal</strong> seu documento de identificação</span
            >
          </div>
          <div class="full-width row">
            <div class="col-12 q-pr-xs">
              <q-file
                v-model="fotoFrente"
                accept="image/*"
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
          <div class="full-width q-mt-md text-center" style="font-size: 1.1rem">
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
          <div class="full-width text-center q-mt-md" style="font-size: 1.1rem">
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
      <div v-if="parte == 4" class="full-width flex flex-center">
        <div class="column full-width" style="font-size: 1.2rem">
          <div class="row">
            <div class="col-5">Nome:</div>
            <div class="col-7 text-bold">{{ user.name }}</div>
          </div>
          <div class="row">
            <div class="col-5">Telefone:</div>
            <div class="col-7 text-bold">{{ user.phone }}</div>
          </div>
          <div class="row">
            <div class="col-5">E-mail:</div>
            <div
              class="col-7 text-bold"
              style="
                overflow-wrap: break-word;
                word-wrap: break-word;
                hyphens: auto;
                white-space: normal;
              "
            >
              {{ user.email }}
            </div>
          </div>
          <div class="row">
            <div class="col-5">CPF:</div>
            <div class="col-7 text-bold">{{ user.cpf }}</div>
          </div>
          <div class="row">
            <div class="col-5">Data da vistia:</div>
            <div class="col-7 text-bold">{{ parseData() }}</div>
          </div>
          <div v-if="!user.hasDocs" class="row q-mt-md">
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
          <span>
            Ao clicar em enviar, declaro que li e concordo com os
            <a href="https://chavi.com.br/termos">termos de uso e priacidade</a
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
              utilizarDocumentos && !user.hasDocs ? (parte -= 1) : (parte -= 2)
            "
          />
          <q-btn
            class="col-6 q-ml-xs"
            label="Enviar"
            type="submit"
            color="positive"
          />
        </q-btn-group>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { Loading, Notify } from "quasar";
import * as moment from "moment";
import { QCalendarDay } from "@quasar/quasar-ui-qcalendar/dist/QCalendarDay.esm.js";
import NavigatioBar from "components/NavigationBar.vue";
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

export default defineComponent({
  name: "PageIndex",
  components: { "q-calendar": QCalendarDay, "navigation-bar": NavigatioBar },
  data() {
    return {
      inForms: false,
      codeSent: false,
      parte: 1,
      selectedDate: "",
      type: "",
      cliente: {},
      events: [],
      /* Info User */
      fotoFrente: [],
      fotoSelfie: [],
      fotoVerso: [],
      user: {
        name: "",
        phone: "",
        cpf: "",
        email: "",
        terms: true,
        hasDocs: false,
      },
      newUser: true,
      isRegistredUser: false,
      /* Opções calendario */
      utilizarDocumentos: true,
      verificarDocumentos: true,
      aprovarVisita: false,
      /* Opções visitas */
      noWeekend: false,
      feriado: false,
      horaInicial: 6,
      horaFinal: 19,
      noSunday: false,
      timeStepMin: 15,
    };
  },
  computed: {
    getFotoFrente() {
      return URL.createObjectURL(this.fotoFrente);
    },
    getFotoAtras() {
      return URL.createObjectURL(this.fotoVerso);
    },
    getFotoSelfie() {
      return URL.createObjectURL(this.fotoSelfie);
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
    phoneMask() {
      return "(##) #####-####";
    },
    getWeekDisplay() {
      let week = [0, 1, 2, 3, 4, 5, 6];
      if (this.noSunday) week = [1, 2, 3, 4, 5, 6];
      if (this.noWeekend) week = [1, 2, 3, 4, 5];
      return week;
    },
  },
  mounted() {
    if (this.login && this.login.user) {
      this.user = {
        name: this.login.user.nome,
        phone: this.login.user.telefone,
        email: this.login.user.email,
        cpf: this.login.user.cpf,
        hasDocs:
          this.login.user.fotoSelfie &&
          this.login.user.fotoFrente &&
          this.login.user.fotoAtras,
        terms: true,
      };
    }
    const params = this.getParams;
    if (params && params.entidadeId && params.imovelRef) {
      this.user.entidadeId = params.entidadeId;
      this.user.imovelRef = params.imovelRef;
      this.carregarHorarios();
    }
    this.setHoliday(new Date().getFullYear());
  },
  methods: {
    async nextStep() {
      if (!this.$refs.forms.validate()) return;
      if (
        this.user.email != this.login.user.email ||
        this.user.cpf != this.login.user.cpf ||
        this.user.name != this.login.user.nome
      ) {
        console.log("opa");
        const response = await this.executeMethod({
          url: "Usuarios/atualizar",
          method: "POST",
          data: {
            dados: {
              id: this.login.userId,
              email: this.user.email,
              cpf: this.user.cpf,
              nome: this.user.name,
            },
          },
        });
        if (response.status == 200) {
          this.login = response.data;
        }
      }
      this.utilizarDocumentos && !this.user.hasDocs
        ? (this.parte += 1)
        : (this.parte += 2);
    },
    parseData() {
      if (this.user.validadeInicial && this.user.validadeFinal) {
        const inicial = moment(new Date(this.user.validadeInicial)).format(
          "DD/MM/YY HH:mm"
        );
        const final = moment(new Date(this.user.validadeFinal)).format("HH:mm");

        return inicial + " - " + final;
      }
      return "";
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
    onTimeClick({ event, scope }) {
      let hora = scope.timestamp.hour;
      let minutos = scope.timestamp.minute;

      const now = moment().format("HH:mm").split(":");
      if (
        scope.timestamp.past ||
        (parseInt(now[0]) == hora && minutos < parseInt(now[1]))
      ) {
        Dialog.create({
          title:
            "<span class='text-primary' style='font-size: 1.4rem'>Aviso</span>",
          message:
            "<span style='font-size: 1.0rem' class='text-black'>Por favor, selecione um horário que ainda não passou.</span>",
          html: true,
          ok: "Ok",
        });
        return;
      }
      if (minutos < 15) minutos = 15;
      else if (minutos < 30) minutos = 30;
      else if (minutos < 45) minutos = 45;
      else if (minutos < 60) minutos = 60;
      const horario =
        hora.toString() +
        ":" +
        (minutos - 15 == 0 ? "00" : minutos - 15).toString();

      if (minutos == 60) hora = parseInt(hora) + 1;

      const horarioNormal =
        hora.toString() +
        ":" +
        (minutos == 60 || minutos == 0 ? "00" : minutos).toString();
      const diaSemana = this.getDayOfWeek(scope.timestamp.weekday);
      Dialog.create({
        title: "<span class='text-primary text-bold'>Agendamento</span>",
        message:
          "<span style='font-size:1.1rem'>Você confirma o seu agendamento <strong> " +
          diaSemana +
          " as " +
          horario +
          "?</strong><br/>A visita terá duarção de <strong>15 minutos</strong>.</span>",
        ok: "Sim",
        cancel: "Escolher outro",
        html: true,
        persistent: true,
      }).onOk(() => {
        const visita = {
          title: "Horário Selecionado",
          date: scope.timestamp.date,
          time: horario,
          duration: 15,
          bgcolor: "green-10",
          textColor: "text-white",
        };
        this.events.push(visita);
        this.user.validadeInicial = new Date(
          scope.timestamp.date + " " + horario
        ).getTime();
        this.user.validadeFinal = new Date(
          scope.timestamp.date + " " + horarioNormal
        ).getTime();
        Loading.show();
        setTimeout(() => {
          this.inForms = true;
          if (this.login && this.login.id && this.login.user) this.parte = 2;
          Loading.hide();
        }, 1500);
      });
    },
    calendarNext() {
      this.$refs.calendar.next();
    },
    calendarToday() {
      this.$refs.calendar.moveToToday();
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    async onSubmit() {
      if (
        this.fotoFrente &&
        this.fotoFrente.length &&
        this.fotoFrente.length == 0
      ) {
        Notify.create({ message: "Insira a foto da frente do seu documento" });
        return;
      }
      if (
        this.fotoVerso &&
        this.fotoVerso.length &&
        this.fotoVerso.length == 0
      ) {
        Notify.create({ message: "Insira a foto do verso do seu documento" });
        return;
      }
      if (
        this.fotoSelfie &&
        this.fotoSelfie.length &&
        this.fotoSelfie.length == 0
      ) {
        Notify.create({ message: "Insira uma selfie sua" });
        return;
      }
      if (!this.user.terms) {
        Notify.create({ message: "Para prosseguir, aceite os termos de uso" });
        return;
      }

      Loading.show({ message: "Gerando a visita..." });
      // Enviar visita
      // Validar fotos caso seja tirada pela camera (Limitar Tamanho)
      let request = {
        url: "Visitas/validarVisita",
        method: "post",
        data: this.user,
      };

      if (!this.user.hasDocs) {
        this.user.fotoFrente = this.fotoFrente;
        this.user.fotoAtras = this.fotoVerso;
        this.user.fotoSelfie = this.fotoSelfie;

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

        let d = { ...this.user };
        let formData = new FormData();
        Object.keys(d).forEach((key) => formData.append(key, d[key]));
        formData.append("fotoFrente", blobFrente.blob, blobFrente.name);
        formData.append("fotoAtras", blobAtras.blob, blobAtras.name);
        formData.append("fotoSelfie", blobSelfie.blob, blobSelfie.name);

        request.headers = { "Content-Type": "multipart/form-data" };
        request.data = formData;
      }
      //const response = {};
      const response = await this.executeMethod(request, false);
      Loading.hide();
      if (response && response.status == 200) {
        console.log(response);
        const message = response.data.text;

        Dialog.create({
          title:
            '<span class="text-primary" style="font-size:1.2rem">Finalizada</span>',
          message: '<span style="font-size:1.0rem"> ' + message + " </span>",
          ok: "Entendido",
          html: true,
          persistent: true,
        }).onOk(() => {
          //TODO: retornar para pag. da imobiliária
          console.log("retornar para pagina da imobiliária");
        });
      } else if (response && response.status) {
        const message = response.data;
        Dialog.create({
          title:
            '<span class="text-primary" style="font-size:1.2rem">Ops, Aconteceu algo inesperado</span>',
          message:
            '<span style="font-size:1.0rem"> ' +
            message +
            "<br/> Revise os dados e tente novamente. </span>",
          ok: "Entendido",
          html: true,
        });
      }
    },
    open(link, opt) {
      opt = opt ? opt : "";
      window.open(link, opt);
    },
    onReset() {
      this.user = { name: "", phone: "", cpf: "", email: "", terms: false };
    },
    onValError(ref) {
      this.parte = 1;
    },
    verificarEmail(valor) {
      const regexp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?/i;
      const regexp2 = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
      return regexp.test(valor) || regexp2.test(valor);
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
            if (this.cliente && this.cliente.preferenciaUsuario) {
              this.utilizarDocumentos = this.cliente.preferenciaUsuario
                .utilizarDocumentos
                ? this.cliente.preferenciaUsuario.utilizarDocumentos
                : true;
              this.aprovarVisita = this.cliente.preferenciaUsuario.aprovarVisita
                ? this.cliente.preferenciaUsuario.aprovarVisita
                : false;
              this.verificarDocumentos = this.cliente.preferenciaUsuario
                .verificarDocumentos
                ? this.cliente.preferenciaUsuario.verificarDocumentos
                : true;
            }
            if (this.cliente && this.cliente.preferenciaVisita) {
              this.noWeekend = this.cliente.preferenciaVisita.finalDeSemana
                ? !this.cliente.preferenciaVisita.finalDeSemana
                : true;
              this.feriado = this.cliente.preferenciaVisita.feriado
                ? this.cliente.preferenciaVisita.feriado
                : false;
              this.timeStepMin = this.cliente.preferenciaVisita.intervalo
                ? this.cliente.preferenciaVisita.intervalo
                : 15;
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
            }
            this.events = response.data.horarios;
            this.formatData();
          } else {
            console.log("deu ruim ", response);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    formatData() {
      if (this.events && this.events.length > 0) {
        let optionsOff = [];
        for (let horario of this.events) {
          const inicio = parseTimestamp(
            moment(horario.timestampInicial).format("YYYY-MM-DD HH:mm")
          );
          const duracao = horario.intervalo / 60000;
          optionsOff.push({
            title: "Ocupado",
            date: inicio.date,
            time: inicio.time,
            duration: duracao,
            bgcolor: "red-5",
            textColor: "text-white",
          });
        }
        this.events = optionsOff;
      }
    },
    async sendPhone() {
      if (this.user && this.user.phone && this.user.phone.length == 15) {
        Loading.show({ message: "Verificando cadastro do usuário" });
        let response = await this.executeMethod(
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
      }
    },
    async checkCodigo() {
      if (this.newUser) {
        Loading.show({ delay: 400 });
        let response = await this.executeMethod(
          {
            url: "Usuarios/cadastrar",
            method: "post",
            data: {
              telefone: this.user.phone,
              nomeCompleto: this.user.name.trim(),
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
      let response = await this.executeMethod(
        {
          url: "Usuarios/novoLogin",
          method: "post",
          data: {
            username: this.user.phone,
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
        this.parte += 1;
      } else {
        Notify.create({
          message: "Número de Telefone inválido ou Código SMS incorreto.",
          type: "warning",
        });
      }
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
  },
});
</script>

<style scoped>
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
</style>
