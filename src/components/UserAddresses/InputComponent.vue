<template>
  <input :value="value" @input="updateValue" />
</template>

<script setup>
const props = defineProps({
  value: String,
});
const emit = defineEmits(["updateValue"]);

function updateValue(event) {
  emit("updateValue", event);
}
</script>

<style scoped>
</style>