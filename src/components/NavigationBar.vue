<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row" style="justify-content: center">
      <q-btn
        no-caps
        class="purple-button navigation-button arrow"
        @click="$emit('prev')"
      >
        <i class="fa-solid fa-arrow-left"></i>
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
        class="purple-button navigation-button arrow"
        @click="$emit('next')"
      >
      <i class="fa-solid fa-arrow-right"></i>
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

.navigation-button.arrow{
  width: initial;
}

.navigation-button .fa-regular{
  width: 30px;
  height: 30px;
  font-size: 25px;
  color: white;
}

@media (max-width: 600px) {
  .navigation-button {
    max-width: 100px;
    flex-direction: column;
    align-items: center;
  }
}

</style>
