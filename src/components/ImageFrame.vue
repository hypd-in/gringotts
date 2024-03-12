<template>
  <figure class="image-holder">
    <img :style="{
      'background': bgColor,
      'border-radius': border_radius ? border_radius : '0',
      'object-fit': objectFit ? objectFit : 'cover',
    }" :class="{
      'blur-fade-in': !loading,
      'padding-left': firstChild,
      'padding-right': lastChild,
      'blur-img-effect': loading,
    }" ref="target" style="height: 100%; width: 100%;" :alt="alt" />
  </figure>
</template>

<script setup>
const props = defineProps({
  src: String,
  border_radius: String,
  objectFit: String,
  firstChild: String,
  lastChild: String,
  alt: String,
});

const observer = ref(null);
const target = ref(null);
const loading = ref(false);
const src = ref("");
const src_details = ref(null);
const config = useRuntimeConfig();

const bgColor = ref('')

const colors = [
'#e8d1c5',
'#ffe45e',
'#dbfdd8',
'#fcd5ce',
'#d0bef2',
'#83b0e1',
'#fd9951',
]

const source = computed(() => {
  return props.src || "";
})

onBeforeMount(() => {
  if (source.value.includes("shopify")) {
    let a;
    if (
      source.value.split(".")[source.value.split(".").length - 2].slice(-1) == "x"
    ) {
      let link_breakdown = source.value.split(".");
      let sub_link = link_breakdown[link_breakdown.length - 2].split("_");
      sub_link.pop();
      sub_link = [...sub_link, "8x"];
      link_breakdown[link_breakdown.length - 2] = sub_link.join("_");
      src_details.value = link_breakdown.join(".");
    } else {
      a = source.value.split(".");
      a[a.length - 2] = a[a.length - 2] + "_8x";
      a = a.join(".");
      src_details.value = a;
    }
  } else if (source.value?.includes(config.public.cdn) && source.value?.includes("?height")) {
    src_details.value =
      source.value.split("?height")[0] + "?height=8";
  } else if (source.value?.includes(config.public.cdn)) {
    src_details.value = source.value + "?height=8";
  } else {
    src_details.value = source.value;
  }
})

function getRandomInt() {
  return Math.floor(Math.random() * colors.length);
}

function loadImage() {
  var newImg = new Image();
  newImg.onload = () => {
    if (target.value) {
      target.value.setAttribute("src", source.value);
    }
    loading.value = false;
  };
  newImg.onerror = () => {
    loading.value = false;
  }
  newImg.src = source.value;
  if (newImg.complete) {
    if (target.value) {
      target.value.setAttribute("src", source.value);
    }
    loading.value = false;
  }
  newImg.src = source.value;
}

function callback(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadImage();
      observer.value.unobserve(target.value);
    }
  })
}

onMounted(() => {
  let index = getRandomInt()
  bgColor.value = colors[index]

  loading.value = true
  if (target.value) {
    target.value.setAttribute("src", src_details.value);
  }

  observer.value = addingObserver(target.value, callback);
});
</script>

<style scoped>
img {
  position: relative;
}

/* style this to fit your needs */
img:after {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: 'Helvetica';
  font-weight: 300;
  line-height: 2;
  text-align: center;
  content: attr(alt);
  background: v-bind(bgColor);
}


.circle {
  border-radius: 50%;
}

.image-holder {
  height: 100%;
  width: 100%;
}

figure {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

figure img {
  height: 100%;
  width: 100%;
}

.blur-img-effect {
  border-radius: 20px;
  filter: blur(5px);
}

.blur-fade-in {
  border-radius: 20px;
  filter: none;
}

.rolling-loader {
  height: 32px !important;
  width: 32px !important;
}

.padding-left {
  padding-left: 16px;
}

.padding-right {
  padding-right: 16px;
}

.contain-image img {
  object-fit: contain !important;
}
</style>
