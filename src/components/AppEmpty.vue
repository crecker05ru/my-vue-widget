<template>
  <div class="empty">
    <p class="empty__text">City not chosen</p>
    <button
      class="empty__settings-button"
      @click="$emit('clickSettings')"
    ></button>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.empty {
  display: flex;
  justify-content: space-between;
  width: 100%;
  &__text {
    font-size: 20px;
  }
  &__settings-button {
    background-image: url("/settings-icon.svg");
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    transition: transform linear 0.2s;
    background-color: transparent;
    border: none;
    &:hover {
      transform: rotate(90deg);
    }
  }
}
</style>
