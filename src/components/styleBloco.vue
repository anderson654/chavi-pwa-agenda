<template>
  <div class="container-blocos">
    <div class="box-blocos">
      <span class="texto-1"
        ><strong>BLOCO{{ blocoSelecionado ? blocoSelecionado.num : 0 }}</strong></span
      >
      <span class="texto-2"
        ><strong>BLOCO{{ blocoSelecionado ? blocoSelecionado.num : 0 }}</strong></span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blocoSelecionado: {},
  },
  name: "StyleBloco",
};
</script>

<style scoped>
.container-blocos {
  display: flex;
  justify-content: center;
  color: #505050;
  scale: 1.2;
  margin-top:15px;
}

.box-blocos {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.texto-1 {
  font-size: 3rem;
  font-weight: 1000;
  transform: scale(1.9, 1.7);
  transform-origin: 0% 70%;
  background-color: #f0f0f0;
  background-image: linear-gradient(
    0deg,
    rgba(240, 240, 240, 1) 33%,
    rgba(150, 84, 255, 1) 140%
  );

  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
.texto-2 {
  text-align: center;
  font-weight: 1000;
  font-size: 3rem;
  position: absolute;
  color: #505050;
  transform: scale(1.3, 1.2) translateX(-6px);
  left: 110px;
  top: 8px;
}

span {
  color: black;
}

@media (max-width: 400px) {
  .container-blocos {
    scale: 0.7;
  }
}
</style>
