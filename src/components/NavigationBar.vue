<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row">
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
@media (max-width: 580px) {
  .navigation-button{
    flex-direction: column;
    align-items: center;
  }
}
.navigation-button{
  max-width: 150px;
  border-radius: 16px;
}
</style>
