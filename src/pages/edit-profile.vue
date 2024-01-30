<template>
  <div class="edit-profile-wrapper">
    {{ store.user?.full_name }}
  </div>
</template>

<script setup>
definePageMeta({
  name: "EditProfile"
})

const store = useStore();
</script>

<style scoped></style>