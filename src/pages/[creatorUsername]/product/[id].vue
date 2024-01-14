<template>
  <div>
    {{ route.params.id }} product from {{ route.params.creatorUsername }}'s store
  </div>
</template>

<script setup>
const route = useRoute()
    onMounted(()=>{
        console.log("PDP mounted")
    })
</script>

<style>

</style>