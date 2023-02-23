<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row">
      <q-btn
        no-caps
        class="purple-button"
        style="max-width: 128px; border-radius: 16px"
        @click="$emit('prev')"
      >
        anterior
      </q-btn>
      <q-btn
        no-caps
        class="purple-button"
        style="max-width: 128px; border-radius: 16px"
        @click="$emit('today')"
      >
        hoje
      </q-btn>

      <q-btn
        no-caps
        class="purple-button"
        style="max-width: 128px; border-radius: 16px"
        @click="$emit('next')"
      >
        próximo
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
