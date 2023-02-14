<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row">
      <q-btn
        no-caps
        class="purple-button"
        style="max-width: 150px"
        @click="$emit('today')"
      >
        Hoje
      </q-btn>
      <q-btn
        no-caps
        class="purple-button"
        style="max-width: 150px"
        @click="$emit('prev')"
      >
        &lt; Anterior
      </q-btn>
      <q-btn
        no-caps
        class="purple-button"
        style="max-width: 150px"
        @click="$emit('next')"
      >
        Próximo &gt;
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
};
</script>

<style></style>
