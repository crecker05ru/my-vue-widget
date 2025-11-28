<template>
  <div class="settings">
    <div class="settings__head">
      <h2 class="settings__title">Settings</h2>
      <div class="settings__close-icon close-icon" @click="$emit('clickCloseSettings')">
        <span class="close-icon__left"></span><span class="close-icon__right"></span>
      </div>
    </div>
    <div class="setting__body">
      <div class="settings__elements-list">
        <draggable
          :animation="200"
          item-key="cities"
          v-model="citiesArr"
          @change="onDragEnd"
        >
          <template #item="{ element: citiesArr }">
            <div class="settings__element element">
              <div class="element__burger burger">
                <span class="burger__line line_top"></span
                ><span class="burger__line line_middle"></span
                ><span class="burger__line line_bottom"></span>
              </div>
              <div class="element__title">
                {{ citiesArr.cityName }} {{ citiesArr.country }}
              </div>
              <div
                class="element__delete"
                @click="() => clickDelete(citiesArr.cityName)"
              ></div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="settings__add-element add-element">
        <div class="add-element__title">Add Location:</div>
        <div class="add-element__input-wrapper">
          <input
            class="add-element__input"
            ref="inputElement"
            @input="onChange"
            @keypress.enter="addCity"
          />
          <button class="add-element__button" @click="addCity"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect } from "vue";
import { ICity } from "@/types";
import draggable from "vuedraggable";

const props = defineProps<{ cities: ICity[] }>();
const citiesArr = ref([...props.cities]);
const emit = defineEmits<{
  clickCloseSettings: [];
  clickDelete: [name: string];
  addCity: [name: string];
  dragEnd: [citiesArr: ICity[]];
}>();

const cityInput = ref("");
const inputElement = ref<HTMLInputElement>();
const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  cityInput.value = target.value;
};

const addCity = () => {
  emit("addCity", cityInput.value);
  cityInput.value = "";
  if (inputElement.value) inputElement.value.value = "";
};

const clickDelete = (name: string) => {
  emit("clickDelete", name);
};

const onDragEnd = () => {
  emit("dragEnd", citiesArr.value);
};

watchEffect(async () => {
  citiesArr.value = [...props.cities];
});
</script>

<style scoped lang="scss">
.settings {
  width: 100%;
  &__head {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  &__title {
    flex: 1 1 auto;
    font-size: 24px;
  }
  &__elements-list {
    margin-bottom: 50px;
  }
}
.close-icon {
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
  &__left {
    position: absolute;
    left: 50%;
    width: 1px;
    height: 100%;
    background-color: #000;
    transform: rotate(45deg);
  }
  &__right {
    position: absolute;
    right: 50%;
    width: 1px;
    height: 100%;
    background-color: #000;
    transform: rotate(-45deg);
  }
}
.element {
  margin-bottom: 20px;
  &__title {
    flex: 1 1 auto;
    margin-left: 10px;
  }
  &__delete {
    width: 24px;
    height: 24px;
    background-image: url("/trash-icon.svg");
    cursor: pointer;
  }
}
.add-element {
  &__title {
    font-size: 24px;
  }
  &__input-wrapper {
    display: flex;
    align-items: center;
    max-width: 100%;
  }
  &__input {
    flex: 1 1 auto;
    max-width: 100%;
    height: 40px;
    margin-right: 10px;
    outline: none;
    padding: 4px;
    border: 1px solid transparent;
    background-color: #f7f7f7;
    &:focus {
      border: 1px solid #0051ff;
    }
  }
  &__button {
    display: block;
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: transparent;
    background-image: url("/enter-icon.svg");
    background-repeat: no-repeat;
    background-size: contain;
  }
}
.burger {
  position: relative;
  width: 24px;
  height: 16px;
  cursor: pointer;
  &__line {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #000;
  }
}
.line {
  &_top {
    top: 0;
  }
  &_middle {
    top: 8px;
  }
  &_bottom {
    top: 16px;
  }
}
.element {
  display: flex;
  align-items: center;
  max-width: 100%;
  min-height: 30px;
  padding: 8px;
  background-color: rgb(247, 247, 247);
  cursor: pointer;
}
</style>
