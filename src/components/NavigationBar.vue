<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row">
      <q-btn
        no-caps
        class="button"
        style="margin: 2px; font-size: 1rem"
        @click="$emit('today')"
      >
        Hoje
      </q-btn>
      <q-btn
        no-caps
        class="button"
        style="margin: 2px; font-size: 1rem"
        @click="$emit('prev')"
      >
        &lt; Anterior
      </q-btn>
      <q-btn
        no-caps
        class="button"
        style="margin: 2px; font-size: 1rem"
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
