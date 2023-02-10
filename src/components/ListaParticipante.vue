<template>
  <div class="container">
    <div class="box">
      <div class="header">
        <h1>Alerta</h1>
        <span @click="$emit('close')">X</span>
      </div>
      <span
        >Informe o número de pessoas externas a hotmilk que irão utilizar o
        espaço.<br />
        Caso não haja visitantes externos, pressione <strong>continuar</strong>
      </span>

      <div class="container-button">
        <button class="btn remover" @click="removerTodosVisitantes">
          Remover todos
        </button>

        <button class="btn adicionar" @click="adicionarVisitante">
          Adicionar
        </button>
      </div>
      <div v-for="(element, index) in list" :key="index" class="list">
        <input
          placeholder="Insira um email"
          class="input"
          type="text"
          v-model="list[index]"
        />
        <span class="material-icons" @click="removerVisitante(index)">
          delete_outline
        </span>
      </div>
      <div class="container-button">
        <button class="btn outroHorario" @click="$emit('close')">
          Escolher outro Horário
        </button>
        <button class="btn continuar" @click="continuar">continuar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListaParticipante",

  data() {
    return {
      list: [""],
      email: [],
      showDialog: true,
      dialogTitle: "aoba",
    };
  },
  computed: {},
  methods: {
    adicionarVisitante() {
      this.list.push([]);
    },

    removerVisitante(param) {
      if (this.list.length > 1) {
        this.list.splice(param, 1);
      }
    },

    removerTodosVisitantes() {
      this.list = [];
      this.list.push([]);
    },

    continuar() {
      const filter = this.list.filter((element) => element != undefined);
      this.list = filter;
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.container {
  /* display: flex;
  justify-content: center; */
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 200px;
  z-index: 999;
  animation: fade-in 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.box {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 5px;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.material-icons {
  font-size: 18px;
  color: var(--q-primary);
  width: 30px;
  height: 20px;
}

.material-icons:hover {
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
}

.header > span {
  color: var(--q-primary);
  padding: 5px;
}

.header > span:hover {
  cursor: pointer;
}

input {
  line-height: 0;
  padding: 0px;
}

.container-button {
  display: flex;
  justify-content: space-between;
}

button {
  background: none;
  border: none;
  padding: 5px;
}

h1 {
  font-size: 1.2rem;
  margin: 0;
  list-style: none;
  color: var(--q-primary);
}

.box {
  max-width: 300px;
}

.list > input {
  width: 250px;
  outline: none;
  border: none;
  border-bottom: solid 2px #e86628;
  height: 40px;
}

.btn {
  filter: brightness(1.1);
  transition: 0.2s;
  margin: 5px;
  cursor: pointer;
}

.outroHorario {
  border: solid 1px var(--q-primary);
  color: var(--q-primary);
}

.adicionar,
.continuar {
  color: var(--q-positive);
  border: solid 1px var(--q-positive);
}

.remover {
  color: var(--q-negative);
  border: solid 1px var(--q-negative);
}
</style>
