<template>
  <figure class="image-holder">
    <img
      :style="{
        'border-radius': border_radius ? border_radius : '0',
        'object-fit': objectFit ? objectFit : 'cover',
      }"
      :class="{
        'blur-fade-in': !loading,
        'padding-left': firstChild,
        'padding-right': lastChild,
        'blur-img-effect': loading,
      }"
      ref="dp"
      style="height: 100%; width: 100%;"
      :alt="alt"
    />
  </figure>
</template>

<script>
export default {
  props: [
    "src",
    "border_radius",
    "objectFit",
    "firstChild",
    "lastChild",
    "alt",
  ],
  data() {
    return {
      observer: null,
      target: null,
      loading: true,
      src_details: "",
    };
  },


  created() {
    if (this.src.includes("shopify")) {
      let a;
      if (
        this.src.split(".")[this.src.split(".").length - 2].slice(-1) == "x"
      ) {
        let link_breakdown = this.src.split(".");
        let sub_link = link_breakdown[link_breakdown.length - 2].split("_");
        sub_link.pop();
        sub_link = [...sub_link, "8x"];
        link_breakdown[link_breakdown.length - 2] = sub_link.join("_");
        this.src_details = link_breakdown.join(".");
      } else {
        a = this.src.split(".");
        a[a.length - 2] = a[a.length - 2] + "_8x";
        a = a.join(".");
        this.src_details = a;
      }
    } else if (this.src.includes(this.$cdn) && this.src.includes("?height")) {
      this.src_details =
        this.src.split("?height")[0] + "?height=8";
    } else if (this.src.includes(this.$cdn)) {
      this.src_details = this.src+"?height=8";
    } else {
      return this.src;
    }
  },
  methods: {
    addingObserver() {
      let options = {
        rootMargin: "0px",
        root: null,
        threshold: 0.1,
      };
      this.observer = new IntersectionObserver(this.callback, options);
      this.target = this.$refs.dp;
      this.observer.observe(this.target);
    },
    callback(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer.unobserve(this.target);
        }
      });
    },
    loadImage() {
      var newImg = new Image();
      let vm = this;
      newImg.onload = () => {
        vm.$refs.dp?.setAttribute("src", vm.src);
        vm.loading = false;
      };
      newImg.src = this.src;
      if (newImg.complete) {
        vm.$refs.dp?.setAttribute("src", vm.src);
        vm.loading = false;
      }
      newImg.src = this.src;
    },
  },
  mounted() {
    if (this.$refs.dp) {
      this.$refs.dp.setAttribute("src", this.src_details);
    }
    this.addingObserver();
  },
};
</script>

<style scoped>
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
