<template>
  <q-page class="flex-center column">
    <div class="text-center q-my-xl" style="width: 70vw">
      <div v-if="inForms">
        <span style="font-size: 1.2rem" v-if="parte != 3"
          >Agora, preencha o formulário solicitando visita ao imóvel
          {{ user && user.imovelRef ? user.imovelRef : "" }} da imobiliária
          {{ cliente }}</span
        >
        <span style="font-size: 1.2rem" v-else-if="parte == 3">
          Estamos quasa finalizando. Para aumentarmos a segurança da sua visita,
          precisamos que valide seu documento de identificação (RG ou CNH)
        </span>
      </div>
      <div v-else>
        <span style="font-size: 1.2rem">
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
      <div style="width: 100%" class="flex flex-center q-pa-md">
        <q-calendar
          ref="calendar"
          weekday-align="left"
          view="week"
          locale="pt-br"
          style="width: 50%"
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
                  :style="badgeStyles(event, timeStartPos, timeDurationHeight)"
                >
                  <div class="title q-calendar__ellipsis">
                    {{ event.title }}
                    <q-tooltip>{{ event.time }}</q-tooltip>
                  </div>
                </div>
              </template>
            </template>
          </template>
        </q-calendar>
      </div>
    </div>
    <q-form
      v-if="inForms"
      lang="pt-BR"
      @submit="onSubmit"
      @reset="onReset"
      @validation-error="onValError"
      class="q-gutter-md"
      style="width: 60vw; max-width: 400px"
    >
      <div v-show="parte == 1" class="full-width">
        <q-input
          class="parte1 full-width"
          v-model="user.name"
          label="Seu nome *"
          hint="Nome e sobrenome"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Insira um nome']"
        />
        <q-input
          class="parte1 full-width"
          type="tel"
          v-model="user.phone"
          label="Seu Telefone *"
          hint="(41) 98888-8888"
          lazy-rules
          :mask="phoneMask"
          :debounce="1000"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Por favor, insira seu telefone.',
          ]"
        />
        <q-input
          class="parte1 full-width"
          type="tel"
          v-model="user.cpf"
          label="Seu CPF *"
          lazy-rules
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
          type="tel"
          v-model="user.email"
          label="Seu E-mail *"
          lazy-rules
          :debounce="1000"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Por favor, insira seu E-mail.',
            (val) => regexp.test(val) || 'Insira um e-mail válido',
          ]"
        />
        <div class="full-width q-mt-xl">
          <q-btn-group push flat unelevated class="full-width row">
            <q-btn
              class="col-6"
              label="Próximo"
              color="positive"
              @click="parte += 1"
            />
            <q-btn
              outline
              label="Limpar"
              type="reset"
              color="secondary"
              class="q-ml-sm col-6"
            />
          </q-btn-group>
        </div>
      </div>
      <div v-show="parte == 2" class="full-width">
        <div class="full-width q-mb-xs">
          <div class="full-width text-left" style="font-size: 1rem">
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
                label="Anexar Foto Frontal"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="full-width text-left q-mt-md" style="font-size: 1rem">
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
                label="Anexar Foto do Verso"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="full-width text-left q-mt-md" style="font-size: 1rem">
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
                label="Anexar Selfie"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
        </div>
        <div>
          <span>
            Ao clicar em enviar, declaro que li e concordo com os
            <a href="https://chavi.com.br/termos">termos de uso e priacidade</a
            >.
          </span>
        </div>
        <div class="full-width q-mt-xl">
          <q-btn-group push flat unelevated class="full-width row">
            <q-btn
              class="col-6"
              label="Enviar"
              type="submit"
              color="positive"
            />
            <q-btn
              v-if="parte == 1"
              outline
              label="Limpar"
              type="reset"
              color="secondary"
              class="q-ml-sm col-6"
            />
            <q-btn
              v-else
              outline
              label="Voltar"
              color="secondary"
              class="q-ml-sm col-6"
              @click="parte -= 1"
            />
          </q-btn-group>
        </div>
      </div>
      <div v-if="parte == 3" class="full-width"></div>
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
      selectedDate: "",
      cliente: "",
      type: "",
      parte: 1,
      timeStepMin: 15,
      fotoFrente: [],
      fotoSelfie: [],
      fotoVerso: [],
      events: [],
      calendarLoading: false,
      modalCamera: false,
      noWeekend: false,
      noSunday: false,
      inForms: false,
      regexp: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i,
      user: { name: "", phone: "", cpf: "", email: "", terms: true },
    };
  },
  computed: {
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
      let horas = 6;
      let intervalo = 60 / this.timeStepMin;
      return horas * intervalo;
    },
    intervalCount() {
      let horas = 14;
      let intervalo = 60 / this.timeStepMin;
      return horas * intervalo;
    },
    disabledBefore() {
      let ts = parseTimestamp(today());
      ts = addToDate(ts, { day: -1 });
      return ts.date;
    },
    phoneMask() {
      return "(##) 9####-####";
    },
    getWeekDisplay() {
      let week = [0, 1, 2, 3, 4, 5, 6];
      if (this.noSunday) week = [1, 2, 3, 4, 5, 6];
      if (this.noWeekend) week = [1, 2, 3, 4, 5];
      return week;
    },
  },
  mounted() {
    const params = this.getParams;
    if (params && params.entidadeId && params.imovelRef) {
      this.user.entidadeId = params.entidadeId;
      this.user.imovelRef = params.imovelRef;
      this.carregarHorarios();
    }
  },
  methods: {
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
    badgeStylesPast(timestamp, timeStartPos, timeDurationHeight) {
      const s = {};
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(timestamp.time) + "px";
        s.height = timeDurationHeight(1) + "px";
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
      const hora = scope.timestamp.hour;
      let minutos = scope.timestamp.minute;

      const now = moment().format("HH:mm").split(":");
      if (
        scope.timestamp.past ||
        (parseInt(now[0]) == hora && minutos < parseInt(now[1]))
      ) {
        Notify.create({
          message: "Por favor, selecione um horário que ainda não passou.",
          type: "warning",
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
        (minutos - 15 == 60 || minutos - 15 == 0
          ? "00"
          : minutos - 15
        ).toString();
      const horarioNormal =
        hora.toString() +
        ":" +
        (minutos == 60 || minutos == 0 ? "00" : minutos).toString();
      const diaSemana = event.target.attributes.arialabel.nodeValue
        .toString()
        .split(",")[0];
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
        this.user.visita = {
          validadeInicial: new Date(scope.timestamp.date + " " + horario),
          validadeFinal: new Date(scope.timestamp.date + " " + horarioNormal),
        };
        Loading.show();
        setTimeout(() => {
          this.inForms = true;
          Loading.hide();
        }, 1500);
      });
    },
    calendarNext() {
      this.calendarLoading = true;
      this.$refs.calendar.next();
      this.calendarLoading = false;
    },
    calendarToday() {
      this.$refs.calendar.moveToToday();
    },
    calendarPrev() {
      this.calendarLoading = true;
      this.$refs.calendar.prev();
      this.calendarLoading = false;
    },
    display(ao) {
      console.log(ao);
    },
    onSubmit() {
      if (!this.fotoFrente) {
        Notify.create({ message: "Insira a foto da frente do seu documento" });
        return;
      }
      if (!this.fotoVerso) {
        Notify.create({ message: "Insira a foto do verso do seu documento" });
        return;
      }
      if (!this.fotoSelfie) {
        Notify.create({ message: "Insira uma selfie sua" });
        return;
      }
      if (!this.user.terms) {
        Notify.create({ message: "Para prosseguir, aceite os termos de uso" });
        return;
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
    takePicture(photo) {
      this.user[this.type] = photo;
      this.modalCamera = false;
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
