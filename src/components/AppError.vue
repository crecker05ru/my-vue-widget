<template>
  <div class="error">
    <p class="error__message" v-if="props?.error">{{ props.error }}</p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  error: Error | string | null;
}>();
</script>
<style lang="scss" scoped>
.error {
  display: grid;
  place-items: center;
  position: absolute;
  width: 320px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: +99;

  &__message {
    color: #cf0b0b;
    font-size: 24px;
  }
}
</style>
