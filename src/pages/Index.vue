<template>
  <q-page class="flex-center column">
    <div class="text-center q-my-xl" style="width: 70vw">
      <span style="font-size: 1.2rem" v-if="parte == 1"
        >Formulário solicitando visita ao imóvel {{ "TAL" }} da imobiliária
        {{ "TAL" }}</span
      >
      <span style="font-size: 1.2rem" v-else-if="parte == 2">
        Para validarmos sua visita, precisamos que valide seu documento de
        identificação (RG ou CNH)
      </span>
    </div>
    <q-form
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
            <!-- <div class="col-6 q-pl-xs">
              <q-btn
                color="primary"
                icon-right="camera"
                label="Tirar foto"
                @click="
                  modalCamera = true;
                  type = 'fotoFrente';
                "
              />
            </div> -->
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
                v-model="fotoVerso"
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
    </q-form>
    <!-- <q-dialog v-model="modalCamera" full-width>
      <easy-camera
        :fullscreen="true"
        :mustApprove="true"
        @input="takePicture"
        v-model="fotoFrente"
      />
    </q-dialog> -->
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import EasyCamera from "easy-vue-camera";
import { Notify } from "quasar";
export default defineComponent({
  name: "PageIndex",
  components: { "easy-camera": EasyCamera },
  data() {
    return {
      type: "",
      fotoFrente: "",
      fotoVerso: "",
      fotoSelfie: "",
      user: { name: "", phone: "", cpf: "", email: "", terms: true },
      regexp: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i,
      parte: 1,
      modalCamera: false,
    };
  },
  computed: {
    phoneMask() {
      return "(##) 9####-####";
    },
  },
  methods: {
    onSubmit() {
      console.log("aqui");
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
      console.log(photo);
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
  },
});
</script>
