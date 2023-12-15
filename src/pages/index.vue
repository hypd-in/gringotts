<template>
  <div>
    Index (/)
    <NuxtLink to="/akarshitkamra">Akarshit</NuxtLink>
  </div>
</template>


<script setup lang="js">
const route = useRoute()

onMounted(()=>{
  console.log("index mounted")
})

</script>