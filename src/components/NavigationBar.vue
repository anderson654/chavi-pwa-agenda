<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row" style="justify-content: center">
      <q-btn
        no-caps
        class="purple-button navigation-button"
        @click="$emit('prev')"
      >
        anterior
      </q-btn>
      <q-btn
        no-caps
        class="purple-button navigation-button"
        @click="$emit('today')"
      >
        hoje
      </q-btn>

      <q-btn
        no-caps
        class="purple-button navigation-button"
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

<style>
.navigation-button {
  max-width: 150px;
  border-radius: 16px;
}
@media (max-width: 600px) {
  .navigation-button {
    max-width: 100px;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 400px) {
  .navigation-button {
    max-width: none;
    width: 100%;
  }
}
</style>
